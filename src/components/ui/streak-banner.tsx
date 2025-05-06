"use client";

import React from "react";
import { Flame } from "lucide-react";

interface StreakBannerProps {
  streakDays: number;
}

export function StreakBanner({ streakDays }: StreakBannerProps) {
  return (
    <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
          <Flame size={16} className="text-amber-500" />
        </div>
        <div>
          <h3 className="font-medium text-sm">Daily Streak</h3>
          <p className="text-xs text-gray-600">{streakDays} days in a row! Keep it up!</p>
        </div>
      </div>
      <span className="text-2xl">🔥</span>
    </div>
  );
} 