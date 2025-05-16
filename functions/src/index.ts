/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";
import { Change } from "firebase-functions";

// Import admin functions
import { setAdminClaim, setupInitialAdmin } from './admin';

// Initialize Firebase Admin SDK
initializeApp();

// Initialize Firestore
const db = getFirestore();

// Export admin functions
export { setAdminClaim, setupInitialAdmin };

/**
 * Cloud Function to verify task completion and reward users
 * 
 * @param {string} userId - The ID of the user who completed the task
 * @param {string} taskId - The ID of the task to be verified
 * @return {Object} - Result of the verification process
 */
export const verifyTaskCompletion = onCall(async (request) => {
  const { userId, taskId } = request.data;

  // Input validation
  if (!userId || !taskId) {
    throw new HttpsError("invalid-argument", "User ID and task ID are required");
  }

  try {
    // Get a reference to the user task
    const userTaskQuery = await db
      .collection("userTasks")
      .where("userId", "==", userId)
      .where("taskId", "==", taskId)
      .where("status", "==", "pending")
      .limit(1)
      .get();

    // Check if user task exists
    if (userTaskQuery.empty) {
      throw new HttpsError(
        "not-found", 
        "No pending task found for this user and task ID combination"
      );
    }

    const userTaskDoc = userTaskQuery.docs[0];
    const userTaskRef = userTaskDoc.ref;
    const userTaskId = userTaskDoc.id;

    // Get task details to determine reward amount
    const taskRef = db.collection("tasks").doc(taskId);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      throw new HttpsError("not-found", "Task not found");
    }

    const taskData = taskDoc.data();
    const rewardAmount = taskData?.reward || 0;

    // Begin a transaction to ensure all updates are atomic
    return db.runTransaction(async (transaction) => {
      // 1. Update user task status
      transaction.update(userTaskRef, {
        status: "completed",
        completedAt: FieldValue.serverTimestamp(),
        rewardGiven: true
      });

      // 2. Update task completion count
      transaction.update(taskRef, {
        completedCount: FieldValue.increment(1)
      });

      // 3. Update user's wallet
      const walletRef = db.collection("wallets").doc(userId);
      const walletDoc = await transaction.get(walletRef);

      if (walletDoc.exists) {
        transaction.update(walletRef, {
          balance: FieldValue.increment(rewardAmount),
          totalEarned: FieldValue.increment(rewardAmount),
          lastUpdated: FieldValue.serverTimestamp()
        });
      } else {
        // Create wallet if it doesn't exist
        transaction.set(walletRef, {
          userId,
          balance: rewardAmount,
          totalEarned: rewardAmount,
          totalWithdrawn: 0,
          pendingWithdrawal: 0,
          lastUpdated: FieldValue.serverTimestamp(),
          withdrawalThreshold: 200 // Default threshold
        });
      }

      // 4. Create transaction record
      const transactionRef = db.collection("transactions").doc();
      transaction.set(transactionRef, {
        userId,
        type: "earning",
        amount: rewardAmount,
        description: `Completed task: ${taskData?.title || "Unknown Task"}`,
        status: "completed",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        relatedTaskId: taskId
      });

      // 5. Update user's stats
      const userRef = db.collection("users").doc(userId);
      transaction.update(userRef, {
        completedTasks: FieldValue.increment(1),
        totalEarnings: FieldValue.increment(rewardAmount)
      });

      logger.info(`Task ${taskId} verified for user ${userId}`, {
        userTaskId,
        reward: rewardAmount
      });

      return {
        success: true,
        message: "Task verified and reward credited",
        rewardAmount
      };
    });
  } catch (error) {
    logger.error("Error verifying task completion:", error);
    throw new HttpsError(
      "internal", 
      "An error occurred while verifying the task completion"
    );
  }
});

/**
 * Cloud Function to automatically reward users when a task is marked as completed
 * This function listens for updates to the userTasks collection
 * When a task status changes to "completed" and rewardGiven is set to true
 * It will credit the user's wallet with the appropriate reward amount
 */
export const rewardUserForTask = onDocumentUpdated({
  document: "userTasks/{docId}",
  region: "us-central1" // You can change this to your preferred region
}, async (event) => {
  try {
    const beforeData = event.data?.before?.data();
    const afterData = event.data?.after?.data();
    
    // If data is not available, exit early
    if (!beforeData || !afterData) {
      logger.error("Missing data in update event", { docId: event.params.docId });
      return null;
    }

    // Only proceed if the task is now completed, rewardGiven was changed to true
    if (
      afterData.status === "completed" &&
      afterData.rewardGiven === true &&
      beforeData.rewardGiven === false
    ) {
      logger.info("Processing reward for completed task", {
        taskId: afterData.taskId,
        userId: afterData.userId
      });

      const taskId = afterData.taskId;
      const userId = afterData.userId;

      // Get reward amount from task
      const taskRef = db.collection("tasks").doc(taskId);
      const taskDoc = await taskRef.get();

      if (!taskDoc.exists) {
        logger.error("Task document not found", { taskId });
        return null;
      }

      const taskData = taskDoc.data();
      // Use the reward field from your schema (instead of rewardAmount from the example)
      const reward = taskData?.reward || 0;

      // Reference to the user's wallet
      const walletRef = db.collection("wallets").doc(userId);
      const walletDoc = await walletRef.get();

      if (walletDoc.exists) {
        // Update existing wallet
        await walletRef.update({
          balance: FieldValue.increment(reward),
          totalEarned: FieldValue.increment(reward),
          lastUpdated: FieldValue.serverTimestamp()
        });
      } else {
        // Create a new wallet for the user
        await walletRef.set({
          userId,
          balance: reward,
          totalEarned: reward,
          totalWithdrawn: 0,
          pendingWithdrawal: 0,
          lastUpdated: FieldValue.serverTimestamp(),
          withdrawalThreshold: 200 // Default threshold
        });
      }

      // Create a transaction record
      await db.collection("transactions").add({
        userId,
        type: "earning",
        amount: reward,
        description: `Completed task: ${taskData?.title || "Unknown Task"}`,
        status: "completed",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        relatedTaskId: taskId
      });

      // Update user's stats
      const userRef = db.collection("users").doc(userId);
      await userRef.update({
        completedTasks: FieldValue.increment(1),
        totalEarnings: FieldValue.increment(reward)
      });

      logger.info("Successfully rewarded user for task completion", {
        userId,
        taskId,
        rewardAmount: reward
      });
    }

    return null;
  } catch (error) {
    logger.error("Error processing task reward:", error);
    return null;
  }
});
