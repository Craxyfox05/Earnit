"use client";

import React from "react";
import { Clock } from "lucide-react";

interface ScarcityNoticeProps {
  remainingCount: number;
}

export function ScarcityNotice({ remainingCount }: ScarcityNoticeProps) {
  return (
    <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
          <Clock size={16} className="text-amber-500" />
        </div>
        <div>
          <h3 className="font-medium text-sm">Limited Tasks Available</h3>
          <p className="text-xs text-gray-600">Only {remainingCount} tasks left today!</p>
        </div>
      </div>
    </div>
  );
}
