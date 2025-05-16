"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, updateDoc, doc, increment, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { verifyTaskCompletion } from "@/lib/cloudFunctions";
import { toast } from "sonner";

interface Task {
  id: string;
  userId: string;
  taskId: string;
  status: string;
  submittedAt: any;
  proofData?: any;
  taskTitle?: string;
  reward?: number;
}

export default function PendingTasksList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    try {
      const q = query(
        collection(db, "userTasks"),
        where("status", "==", "pending")
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      
      // Get task details for each pending task
      const enhancedData = await Promise.all(
        data.map(async (task) => {
          try {
            const taskDoc = await getDoc(doc(db, "tasks", task.taskId));
            const taskData = taskDoc.data();
            return {
              ...task,
              taskTitle: taskData?.title || "Unknown Task",
              reward: taskData?.reward || 0,
            };
          } catch (error) {
            console.error("Error fetching task details:", error);
            return task;
          }
        })
      );
      
      setTasks(enhancedData);
    } catch (error) {
      console.error("Error fetching pending tasks:", error);
      toast.error("Failed to load pending tasks");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(task: Task) {
    try {
      // Use the cloud function to verify task completion
      const result = await verifyTaskCompletion(task.userId, task.taskId);
      
      // Update local state
      setTasks((prevTasks) => 
        prevTasks.filter((t) => t.id !== task.id)
      );
      
      // Cast result to any to access properties
      const resultData = result as any;
      toast.success(`Task approved and user rewarded with ${resultData.rewardAmount || 'reward'}`);
    } catch (error: any) {
      console.error("Error approving task:", error);
      toast.error(error.message || "Failed to approve task");
    }
  }

  async function handleReject(task: Task) {
    try {
      // Update task status to rejected
      const taskRef = doc(db, "userTasks", task.id);
      await updateDoc(taskRef, {
        status: "rejected",
        completedAt: new Date()
      });

      // Update local state
      setTasks((prevTasks) => 
        prevTasks.filter((t) => t.id !== task.id)
      );

      toast.success("Task rejected");
    } catch (error: any) {
      console.error("Error rejecting task:", error);
      toast.error(error.message || "Failed to reject task");
    }
  }

  async function handleManualApprove(task: Task) {
    try {
      // Step 1: Update task status to completed
      const taskRef = doc(db, "userTasks", task.id);
      await updateDoc(taskRef, {
        status: "completed",
        completedAt: new Date(),
        rewardGiven: true,
      });

      // Step 2: Update wallet balance using increment
      const reward = task.reward || 10; // fallback to 10 if not available
      const walletRef = doc(db, "wallets", task.userId);
      await updateDoc(walletRef, {
        balance: increment(reward),
        totalEarned: increment(reward),
        lastUpdated: new Date(),
      });

      // Step 3: Create transaction record
      const transactionRef = doc(collection(db, "transactions"));
      await updateDoc(transactionRef, {
        userId: task.userId,
        type: "earning",
        amount: reward,
        description: `Completed task: ${task.taskTitle || "Unknown Task"}`,
        status: "completed",
        createdAt: new Date(),
        relatedTaskId: task.taskId
      });

      // Update local state
      setTasks((prevTasks) => 
        prevTasks.filter((t) => t.id !== task.id)
      );

      toast.success(`Task manually approved and rewarded with ${reward}`);
    } catch (error: any) {
      console.error("Error with manual approval:", error);
      toast.error(error.message || "Failed to approve task manually");
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading pending tasks...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📝 Pending Tasks ({tasks.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No pending tasks found
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="p-4 border rounded-lg shadow-sm">
                <p className="font-semibold">{task.taskTitle || `Task ID: ${task.taskId}`}</p>
                <p className="text-sm text-muted-foreground mb-1">User ID: {task.userId}</p>
                <p className="text-sm text-muted-foreground mb-2">
                  Submitted: {task.submittedAt?.toDate?.()?.toLocaleString() || 'Unknown date'}
                </p>
                
                {task.proofData && (
                  <div className="my-2">
                    <p className="text-sm font-medium">Proof submitted:</p>
                    <p className="text-sm bg-muted p-2 rounded">{task.proofData}</p>
                  </div>
                )}
                
                <div className="flex gap-2 mt-3">
                  <Button 
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => handleApprove(task)}
                  >
                    ✅ Approve
                  </Button>
                  <Button 
                    variant="outline"
                    className="text-red-500 border-red-500"
                    onClick={() => handleReject(task)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 