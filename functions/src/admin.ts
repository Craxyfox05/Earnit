import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getAuth } from "firebase-admin/auth";
import * as logger from "firebase-functions/logger";
import { getFirestore } from "firebase-admin/firestore";

// Get Firestore instance
const db = getFirestore();

/**
 * Function to set admin claims for a user
 * This function should only be callable by existing admins
 */
export const setAdminClaim = onCall({
  region: "us-central1",
  // Ensure only authenticated users can call this function
  enforceAppCheck: true
}, async (request) => {
  // Get the caller's UID and verify their admin status
  const callerUid = request.auth?.uid;
  if (!callerUid) {
    throw new HttpsError("unauthenticated", "User must be authenticated to call this function");
  }

  // Check if the caller has admin claims
  const callerToken = request.auth?.token;
  if (!callerToken?.admin) {
    throw new HttpsError("permission-denied", "Only admins can set admin claims");
  }

  // Get the target user ID and admin status from the request
  const { targetUid, isAdmin } = request.data;
  if (!targetUid) {
    throw new HttpsError("invalid-argument", "Target user ID is required");
  }

  try {
    // Set the admin claim
    await getAuth().setCustomUserClaims(targetUid, { admin: Boolean(isAdmin) });
    
    // Update the user document in Firestore
    await db.collection('users').doc(targetUid).set({
      isAdmin: Boolean(isAdmin),
      adminUpdatedAt: new Date(),
      adminUpdatedBy: callerUid
    }, { merge: true });
    
    logger.info(`Admin status updated for user ${targetUid}`, {
      callerUid,
      targetUid,
      isAdmin
    });

    return {
      success: true,
      message: `User ${targetUid} admin status updated to ${isAdmin}`
    };
  } catch (error) {
    logger.error("Error setting admin claim", error);
    throw new HttpsError("internal", "Failed to update admin status");
  }
});

/**
 * Function to setup the initial admin user
 * This function uses a secret key for authorization to ensure only authorized users can create the first admin
 * After setting up the first admin, this function should no longer be used
 */
export const setupInitialAdmin = onCall({
  region: "us-central1"
}, async (request) => {
  // Get the UID and secret key from the request
  const { uid, secretKey } = request.data;
  
  // Validate the input
  if (!uid || !secretKey) {
    throw new HttpsError("invalid-argument", "UID and secret key are required");
  }
  
  // Check if the secret key matches the expected value
  // In a real deployment, use Firebase Config or Secret Manager for this
  const SETUP_SECRET_KEY = process.env.ADMIN_SETUP_SECRET || "your-secret-key-here";
  
  if (secretKey !== SETUP_SECRET_KEY) {
    throw new HttpsError("permission-denied", "Invalid secret key");
  }
  
  try {
    // Verify the user exists
    const userRecord = await getAuth().getUser(uid);
    
    // Check if there are already admin users
    const adminSnapshot = await db.collection('users')
      .where('isAdmin', '==', true)
      .limit(1)
      .get();
    
    if (!adminSnapshot.empty) {
      throw new HttpsError(
        "failed-precondition", 
        "An admin user already exists. Use setAdminClaim function instead."
      );
    }
    
    // Set admin claim
    await getAuth().setCustomUserClaims(uid, { admin: true });
    
    // Update user document
    await db.collection('users').doc(uid).set({
      isAdmin: true,
      adminUpdatedAt: new Date(),
      adminSetupComplete: true
    }, { merge: true });
    
    logger.info(`Initial admin setup complete for user ${uid}`);
    
    return {
      success: true,
      message: `User ${userRecord.displayName || uid} is now an admin`
    };
  } catch (error) {
    logger.error("Error setting up initial admin", error);
    throw new HttpsError("internal", "Failed to set up initial admin");
  }
}); 