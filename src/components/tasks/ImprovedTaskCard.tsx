"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { YoutubeIcon, InstagramIcon, FileTextIcon, Music2Icon, Clock3 } from "lucide-react";
import { motion } from "framer-motion";

// Task types interface
interface Task {
  id: string;
  platform: string;
  title: string;
  description: string;
  payout: number;
  currency: string;
  url: string;
  timeEstimate?: string; // e.g., "30 seconds", "1 minute"
  remainingToday?: number; // For displaying limited availability
}

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  disabled?: boolean;
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
    <div className={`rounded-full p-2 ${getBgColor()} shadow-lg`} style={{
      boxShadow: "0 2px 0 rgba(0,0,0,0.2), 0 3px 8px rgba(0,0,0,0.1)",
      border: "1px solid rgba(255,255,255,0.1)"
    }}>
      {getIcon()}
    </div>
  );
};

export default function ImprovedTaskCard({ task, onClick, disabled = false }: TaskCardProps) {
  const {
    platform,
    title,
    description,
    payout,
    currency,
    url,
    timeEstimate = "30 seconds",
    remainingToday
  } = task;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={disabled ? "opacity-70" : ""}
    >
      <Card className="overflow-hidden task-card rounded-xl">
        <CardContent className="p-0">
          <div className="flex items-start p-4 gap-3">
            {/* Platform Icon */}
            <div className="flex-shrink-0">
              <PlatformIcon platform={platform} />
            </div>

            {/* Task Content */}
            <div className="flex-grow space-y-1">
              <div className="flex justify-between items-start w-full">
                <div className="space-y-1">
                  <Badge 
                    variant="outline" 
                    className="capitalize mb-1 bg-white/50 font-medium text-xs shadow-sm"
                    style={{
                      border: "1px solid rgba(0,0,0,0.05)",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
                    }}
                  >
                    {platform}
                  </Badge>
                  <h3 className="font-semibold text-base text-gray-800">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>

                  {/* Time estimate */}
                  <div className="flex items-center text-xs text-muted-foreground mt-2">
                    <Clock3 className="w-3 h-3 mr-1" />
                    Earn <span className="money-text font-medium">
                      {currency}{payout}
                    </span> in {timeEstimate}
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-3">
                  <div className="flex flex-col items-end gap-1">
                    <Badge className="accent-color font-bold" style={{
                      boxShadow: "0 2px 0 rgba(26,123,68,0.5), 0 2px 5px rgba(0,0,0,0.1)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      padding: "0.25rem 0.625rem"
                    }}>
                      +{currency}{payout}
                    </Badge>

                    {/* Show limited availability if applicable */}
                    {remainingToday !== undefined && remainingToday <= 5 && (
                      <span className="text-xs pending-text">
                        Only {remainingToday} left today!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="px-4 py-3 border-t">
            <Button
              onClick={onClick}
              disabled={disabled}
              className="w-full rounded-lg cta-button scale-on-tap transition-all border-0"
            >
              {disabled ? "Completed ✓" : "Complete Task"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
