"use client";

import { Flame } from "lucide-react";
import { motion } from "framer-motion";

interface StreakBannerProps {
  streakDays: number;
}

export function StreakBanner({ streakDays }: StreakBannerProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-3 border border-amber-100 shadow-card"
    >
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-full p-2 shadow-lg">
          <Flame size={20} className="text-white" />
        </div>
        <div>
          <h3 className="font-medium text-sm">Daily Streak</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-amber-600">{streakDays} day{streakDays !== 1 ? 's' : ''}</span>
            <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
            <span className="text-xs text-muted-foreground">Keep it going!</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 