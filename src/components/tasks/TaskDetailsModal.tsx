"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { YoutubeIcon, InstagramIcon, FileTextIcon, Music2Icon } from "lucide-react";

interface Task {
  id: string;
  platform: string;
  title: string;
  description: string;
  payout: number;
  currency: string;
  url: string;
  timeEstimate?: string;
  remainingToday?: number;
}

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (taskId: string) => void;
}

// Platform icon mapper with solid colors
const PlatformIcon = ({ platform }: { platform: string }) => {
  const iconClasses = "w-6 h-6 text-white";

  const getBgColor = () => {
    switch (platform) {
      case "youtube":
        return "bg-red-600";
      case "instagram":
        return "bg-pink-600";
      case "tiktok":
        return "bg-black";
      case "survey":
        return "bg-gray-700";
      default:
        return "primary-color";
    }
  };

  const getIcon = () => {
    switch (platform) {
      case "youtube":
        return <YoutubeIcon className={iconClasses} />;
      case "instagram":
        return <InstagramIcon className={iconClasses} />;
      case "tiktok":
        return <Music2Icon className={iconClasses} />;
      case "survey":
        return <FileTextIcon className={iconClasses} />;
      default:
        return <FileTextIcon className={iconClasses} />;
    }
  };

  return (
    <div className={`rounded-full p-2 ${getBgColor()} shadow-lg`}>
      {getIcon()}
    </div>
  );
};

export default function TaskDetailsModal({ task, isOpen, onClose, onComplete }: TaskDetailsModalProps) {
  if (!task) return null;

  // Generate task-specific rules and steps
  const generateRulesAndSteps = (platform: string) => {
    switch (platform) {
      case "youtube":
        return {
          rules: [
            "Watch the video for at least 30 seconds",
            "Like the video",
            "Subscribe to the channel",
            "Comment (optional for bonus)"
          ],
          steps: [
            "Click the 'Go to Task' button below",
            "Watch at least 30 seconds of the video",
            "Click the subscription button and bell icon",
            "Return to this app and click Complete"
          ]
        };
      case "instagram":
        return {
          rules: [
            "Follow the profile",
            "Like the most recent post",
            "Engagement must be genuine"
          ],
          steps: [
            "Click the 'Go to Task' button below",
            "Follow the profile",
            "Find the most recent post and like it",
            "Return to this app and click Complete"
          ]
        };
      case "survey":
        return {
          rules: [
            "Answer all questions truthfully",
            "Complete the entire survey",
            "One submission per user"
          ],
          steps: [
            "Click the 'Go to Task' button below",
            "Complete all questions in the survey",
            "Submit your responses",
            "Return to this app and click Complete"
          ]
        };
      default:
        return {
          rules: ["Complete the task as instructed"],
          steps: ["Go to the task", "Follow the instructions", "Return and click Complete"]
        };
    }
  };

  const { rules, steps } = generateRulesAndSteps(task.platform);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <PlatformIcon platform={task.platform} />
            <DialogTitle className="text-xl">{task.title}</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-gray-600">{task.description}</p>
            <div className="flex items-center mt-2 text-sm text-green-600 font-medium">
              <span>Earn {task.currency}{task.payout} in {task.timeEstimate}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800">Task Rules:</h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {rules.map((rule, index) => (
                <li key={index} className="text-gray-600">{rule}</li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800">Steps to Complete:</h4>
            <ol className="list-decimal pl-5 text-sm space-y-2">
              {steps.map((step, index) => (
                <li key={index} className="text-gray-600">{step}</li>
              ))}
            </ol>
          </div>
          
          <div className="pt-3 flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            
            <a 
              href={task.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1"
            >
              <Button className="w-full secondary-gradient">
                Go to Task
              </Button>
            </a>
            
            <Button
              onClick={() => onComplete(task.id)}
              className="flex-1 cta-button"
            >
              Complete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 