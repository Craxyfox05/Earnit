"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ActivityItem {
  id: string;
  userName: string;
  location: string;
  action: string;
}

interface ActivityTickerProps {
  activityItems: ActivityItem[];
}

// Sample activities
const DEFAULT_ACTIVITIES: ActivityItem[] = [
  { id: "1", userName: "Ritika", location: "Mumbai", action: "earned ₹5 for subscribing" },
  { id: "2", userName: "Vikram", location: "", action: "completed a YouTube task" },
  { id: "3", userName: "10 users", location: "", action: "completed tasks in the last 10 minutes" },
  { id: "4", userName: "Ravi", location: "Delhi", action: "earned ₹15 from a survey" },
  { id: "5", userName: "Priya", location: "", action: "just referred a friend and earned ₹5" },
  { id: "6", userName: "Amit", location: "", action: "withdrew ₹200 to UPI" },
];

export function ActivityTicker({ activityItems }: ActivityTickerProps) {
  const [visibleItems, setVisibleItems] = useState<ActivityItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activityItems.length === 0) return;

    // Initially show the first item
    setVisibleItems([activityItems[0]]);

    // Set up the interval to rotate through items
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % activityItems.length;

        // Update visible items
        setVisibleItems([activityItems[nextIndex]]);

        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [activityItems]);

  if (activityItems.length === 0) return null;

  return (
    <div className="w-full overflow-hidden bg-muted/30 rounded-lg py-2 px-4">
      <AnimatePresence mode="wait">
        {visibleItems.map((item) => (
          <motion.div
            key={item.id}
            className="flex items-center justify-center gap-2 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex-1 truncate text-muted-foreground">
              {item.userName} {item.location} {item.action}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
