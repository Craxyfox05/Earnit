"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { YoutubeIcon, InstagramIcon, FileTextIcon, Music2Icon } from "lucide-react";

// Task types interface
interface Task {
  id: string;
  platform: string;
  title: string;
  description: string;
  payout: number;
  currency: string;
  url: string;
}

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

// Platform icon mapper with new color scheme
const PlatformIcon = ({ platform }: { platform: string }) => {
  const iconClasses = "w-6 h-6 text-white";

  const getBgClass = () => {
    switch (platform) {
      case "youtube":
        return "bg-red-500";
      case "instagram":
        return "bg-purple-500";
      case "tiktok":
        return "bg-black";
      case "survey":
        return "bg-primary";
      default:
        return "bg-primary";
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
    <div className={`rounded-full p-2 ${getBgClass()}`}>
      {getIcon()}
    </div>
  );
};

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const { platform, title, description, payout, currency, url } = task;

  return (
    <Card className="overflow-hidden soft-shadow card-hover transition-all bg-card">
      <CardContent className="p-0">
        <div className="flex items-start p-4 gap-3">
          {/* Platform Icon */}
          <div className="flex-shrink-0">
            <PlatformIcon platform={platform} />
          </div>

          {/* Task Content */}
          <div className="flex-grow space-y-1">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="outline" className="capitalize mb-1.5 bg-muted">
                  {platform}
                </Badge>
                <h3 className="font-medium text-base">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>

              <div className="text-right flex-shrink-0 ml-3">
                <div className="text-lg font-bold text-success">{currency}{payout}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="bg-muted/30 px-4 py-3 flex justify-end border-t">
          <Button
            onClick={onClick}
            className="rounded-full text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Start Task
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
