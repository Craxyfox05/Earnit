"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Task, completeTask } from "@/lib/firestore";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  ArrowUpRight, 
  ExternalLink, 
  Clock, 
  Check, 
  Loader2,
  Youtube,
  Instagram,
  BarChart3
} from "lucide-react";

interface TaskCompletionCardProps {
  task: Task;
  onComplete: () => void;
}

export function TaskCompletionCard({ task, onComplete }: TaskCompletionCardProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState<null | NodeJS.Timeout>(null);
  const [countdown, setCountdown] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Function to handle opening the task
  const handleOpenTask = () => {
    // Open task URL in new window
    const newWindow = window.open(task.url, '_blank');
    
    // Start countdown based on time estimate (we'll simulate with 10 seconds for demo)
    const countdownSeconds = 10;
    setCountdown(countdownSeconds);
    
    // Start the countdown
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimer(interval);
  };

  // Function to handle task completion
  const handleCompleteTask = async () => {
    if (!user) {
      toast.error("You must be logged in to complete tasks");
      return;
    }
    
    setLoading(true);
    
    try {
      // Send completion request to Firestore
      const success = await completeTask(user.uid, task.id, {
        completedAt: new Date().toISOString(),
        browser: navigator.userAgent
      });
      
      if (success) {
        toast.success(`Task completed! Earned ${task.reward} rupees`);
        setCompleted(true);
        onComplete();
      } else {
        toast.error("Failed to complete task. Please try again.");
      }
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("An error occurred while completing the task");
    } finally {
      setLoading(false);
    }
  };

  // Get platform icon
  const getPlatformIcon = () => {
    switch (task.platform) {
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

  return (
    <Card className="overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex gap-2 items-center">
            {getPlatformIcon()}
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
        <p className="text-sm text-gray-600">{task.description}</p>
        
        <div className="flex items-center gap-2 mt-2">
          <Clock size={14} className="text-gray-400" />
          <span className="text-xs text-gray-500">{task.timeEstimate}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-1">
        {!timer && !completed ? (
          <Button 
            variant="default" 
            className="w-full" 
            onClick={handleOpenTask}
            disabled={loading}
          >
            <ExternalLink size={16} className="mr-2" />
            Start Task
          </Button>
        ) : completed ? (
          <Button 
            variant="outline" 
            className="w-full bg-green-50 text-green-700 border-green-200"
            disabled
          >
            <Check size={16} className="mr-2" />
            Completed
          </Button>
        ) : countdown > 0 ? (
          <Button 
            variant="outline" 
            className="w-full"
            disabled
          >
            <Clock size={16} className="mr-2 animate-pulse" />
            Verify in {countdown}s
          </Button>
        ) : (
          <Button 
            variant="default" 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={handleCompleteTask}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check size={16} className="mr-2" />
                Mark Completed
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 