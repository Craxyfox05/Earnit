"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  getAvailableTasks, 
  Task,
  completeTask,
  createUserTaskSubmission,
  checkUserTaskExists
} from "@/lib/firestore";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { 
  CheckCircle, 
  ExternalLink, 
  Youtube, 
  Instagram,
  BarChart3,
  Clock,
  Filter,
  AlertCircle
} from "lucide-react";
import { verifyTaskCompletion } from "@/lib/cloudFunctions";

// Define options for task completion approach
interface TaskVerificationOptions {
  requiresReview?: boolean; // If false, auto-verify with Cloud Function
}

export function TaskGrid() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [submittedTaskIds, setSubmittedTaskIds] = useState<string[]>([]);

  // Fetch tasks on component mount
  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      try {
        const fetchedTasks = await getAvailableTasks();
        setTasks(fetchedTasks);

        // If user is logged in, check for already submitted tasks
        if (user) {
          const alreadySubmitted: string[] = [];
          for (const task of fetchedTasks) {
            const exists = await checkUserTaskExists(user.uid, task.id);
            if (exists) {
              alreadySubmitted.push(task.id);
            }
          }
          setSubmittedTaskIds(alreadySubmitted);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [user]);

  // Handle task completion
  const handleCompleteTask = async (taskId: string, options: TaskVerificationOptions = { requiresReview: true }) => {
    if (!user) {
      toast.error("You must be logged in to complete tasks");
      return;
    }

    // Check if the user has already submitted this task
    if (submittedTaskIds.includes(taskId)) {
      toast.error("You have already submitted this task");
      return;
    }

    setCompletingTaskId(taskId);

    try {
      const task = tasks.find(t => t.id === taskId);
      
      if (!task) {
        toast.error("Task not found");
        return;
      }
      
      // If the task doesn't require admin review, use the Cloud Function for immediate verification
      if (!options.requiresReview) {
        const proofData = {
          completedAt: new Date().toISOString(),
          browser: navigator.userAgent,
          autoVerified: true
        };
        
        // Create user task submission first
        const submissionId = await createUserTaskSubmission(user.uid, taskId, proofData);
        
        if (!submissionId) {
          toast.error("Failed to submit task. You may have already submitted this task.");
          return;
        }
        
        // Call the Cloud Function to verify and reward immediately
        const result = await verifyTaskCompletion(user.uid, taskId);
        
        if ((result as any).success) {
          toast.success(`Task completed! You earned ₹${(result as any).rewardAmount}`);
          // Add to submitted tasks list
          setSubmittedTaskIds([...submittedTaskIds, taskId]);
        } else {
          toast.error("Failed to verify task completion");
        }
        
        return;
      }
      
      // For tasks requiring review, use the existing submission logic
      const submissionId = await createUserTaskSubmission(user.uid, taskId, {
        completedAt: new Date().toISOString(),
        browser: navigator.userAgent
      });

      if (submissionId) {
        toast.success(`Task submitted for review!`);
        
        // Add to submitted tasks list
        setSubmittedTaskIds([...submittedTaskIds, taskId]);
      } else {
        toast.error("Failed to submit task. You may have already submitted this task.");
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      toast.error("An error occurred while submitting the task");
    } finally {
      setCompletingTaskId(null);
    }
  };

  // Filter tasks based on category or platform
  const filteredTasks = tasks.filter(task => {
    if (activeFilter === "all") return true;
    if (activeFilter === "youtube" || activeFilter === "instagram" || activeFilter === "survey") {
      return task.platform === activeFilter;
    }
    return task.category === activeFilter;
  });

  // Get platform icon
  const getPlatformIcon = (platform?: string) => {
    switch (platform) {
      case 'youtube':
        return <Youtube className="text-red-500" size={18} />;
      case 'instagram':
        return <Instagram className="text-pink-500" size={18} />;
      case 'survey':
        return <BarChart3 className="text-amber-500" size={18} />;
      default:
        return <ExternalLink className="text-blue-500" size={18} />;
    }
  };

  // Render loading skeletons
  if (loading) {
    return (
      <div>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 flex-shrink-0 rounded-full" />
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Categories from tasks for filters
  const categories = ["all", ...new Set(tasks.map(task => task.category).filter(Boolean))];
  const platforms = ["youtube", "instagram", "survey"].filter(platform => 
    tasks.some(task => task.platform === platform)
  );

  return (
    <div className="space-y-4">
      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Badge
          variant={activeFilter === "all" ? "default" : "outline"}
          className="cursor-pointer px-3 py-1"
          onClick={() => setActiveFilter("all")}
        >
          All Tasks
        </Badge>
        
        {categories.filter(c => c !== "all" && c).map((category) => (
          <Badge
            key={category}
            variant={activeFilter === category ? "default" : "outline"}
            className="cursor-pointer px-3 py-1"
            onClick={() => setActiveFilter(category || "")}
          >
            {category}
          </Badge>
        ))}
        
        {platforms.map((platform) => (
          <Badge
            key={platform}
            variant={activeFilter === platform ? "default" : "outline"}
            className={`cursor-pointer px-3 py-1 ${
              platform === "youtube" ? "bg-red-100 text-red-800 hover:bg-red-200 border-red-200" :
              platform === "instagram" ? "bg-pink-100 text-pink-800 hover:bg-pink-200 border-pink-200" :
              platform === "survey" ? "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200" :
              ""
            }`}
            onClick={() => setActiveFilter(platform)}
          >
            <span className="flex items-center gap-1">
              {getPlatformIcon(platform)}
              <span className="capitalize">{platform}</span>
            </span>
          </Badge>
        ))}
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-muted-foreground">No tasks available in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredTasks.map((task) => {
            const isSubmitted = submittedTaskIds.includes(task.id);
            
            return (
              <Card 
                key={task.id} 
                className={`overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${
                  isSubmitted ? 'bg-gray-50' : ''
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2 items-center">
                      {getPlatformIcon(task.platform)}
                      <CardTitle className="text-base">{task.title}</CardTitle>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                    >
                      ₹{task.reward}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-xs text-gray-500">{task.timeEstimate}</span>
                    </div>
                    
                    {task.category && (
                      <Badge variant="secondary" className="text-xs">
                        {task.category}
                      </Badge>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="pt-1">
                  {isSubmitted ? (
                    <Button 
                      variant="outline" 
                      className="w-full bg-amber-50 text-amber-700 border-amber-200"
                      disabled
                    >
                      <span className="flex items-center gap-2">
                        <AlertCircle size={16} />
                        Pending Review
                      </span>
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      className="w-full"
                      onClick={() => handleCompleteTask(task.id)}
                      disabled={completingTaskId === task.id || isSubmitted}
                    >
                      {completingTaskId === task.id ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <CheckCircle size={16} />
                          Complete Task
                        </span>
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
} 