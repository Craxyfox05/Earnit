"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, CalendarDays, Clock } from "lucide-react";

interface CompletedTask {
  id: string;
  taskId: string;
  taskTitle: string;
  completedAt: Date;
  rewardAmount: number;
  status: string;
}

export function CompletedTasks() {
  const { user } = useAuth();
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompletedTasks() {
      if (!user) return;

      setLoading(true);
      try {
        // Query userTasks collection for completed tasks of the current user
        const userTasksQuery = query(
          collection(db, "userTasks"),
          where("userId", "==", user.uid),
          where("status", "==", "completed"),
          orderBy("completedAt", "desc")
        );

        const userTasksDocs = await getDocs(userTasksQuery);
        
        // Process each document and fetch the corresponding task details
        const tasksData: CompletedTask[] = [];
        
        for (const taskDoc of userTasksDocs.docs) {
          const taskData = taskDoc.data();
          
          // Get the task title from the tasks collection
          const taskRef = doc(db, "tasks", taskData.taskId);
          const taskSnapshot = await getDoc(taskRef);
          
          if (taskSnapshot.exists()) {
            const originalTask = taskSnapshot.data();
            
            tasksData.push({
              id: taskDoc.id,
              taskId: taskData.taskId,
              taskTitle: originalTask.title || "Unknown Task",
              completedAt: taskData.completedAt?.toDate() || new Date(),
              rewardAmount: originalTask.reward || 0,
              status: taskData.status
            });
          }
        }
        
        setCompletedTasks(tasksData);
      } catch (error) {
        console.error("Error fetching completed tasks:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompletedTasks();
  }, [user]);

  // Format date to a readable string
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  // Format time to a readable string
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Completed Tasks</h2>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="w-full h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  if (completedTasks.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Completed Tasks</h2>
        <Card className="bg-gray-50 border-gray-100">
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center space-y-2">
            <div className="p-2 bg-gray-100 rounded-full">
              <CheckCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">You haven't completed any tasks yet.</p>
            <p className="text-sm text-muted-foreground">Complete tasks to earn rewards and see them here.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Completed Tasks</h2>
      <div className="space-y-3">
        {completedTasks.map((task) => (
          <Card key={task.id} className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{task.taskTitle}</CardTitle>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  ₹{task.rewardAmount}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarDays size={14} />
                  <span>{formatDate(task.completedAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{formatTime(task.completedAt)}</span>
                </div>
                <Badge variant="secondary" className="bg-green-50 text-green-600 border-green-100">
                  <CheckCircle size={14} className="mr-1" />
                  Completed
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 