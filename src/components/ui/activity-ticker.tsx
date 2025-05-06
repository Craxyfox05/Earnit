"use client";

import React from "react";
import { motion } from "framer-motion";

interface ActivityItem {
  id: string;
  userName: string;
  location: string;
  action: string;
}

interface ActivityTickerProps {
  activityItems: ActivityItem[];
}

export function ActivityTicker({ activityItems }: ActivityTickerProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-2 overflow-hidden border border-gray-100">
      <div className="flex">
        <span className="text-xs font-medium bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">LIVE</span>
        <div className="flex-1 overflow-hidden ml-2">
          <motion.div
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 15,
                ease: "linear",
              },
            }}
            className="flex whitespace-nowrap"
          >
            {activityItems.map((item) => (
              <div key={item.id} className="inline-block mx-3">
                <span className="text-xs">
                  <span className="font-semibold">{item.userName}</span>
                  <span className="text-gray-500"> from </span>
                  <span className="font-semibold">{item.location}</span>
                  <span className="text-gray-500"> {item.action}</span>
                </span>
              </div>
            ))}
            {activityItems.map((item) => (
              <div key={`repeat-${item.id}`} className="inline-block mx-3">
                <span className="text-xs">
                  <span className="font-semibold">{item.userName}</span>
                  <span className="text-gray-500"> from </span>
                  <span className="font-semibold">{item.location}</span>
                  <span className="text-gray-500"> {item.action}</span>
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
