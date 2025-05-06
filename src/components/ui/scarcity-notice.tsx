"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, AlertCircle, AlertTriangle } from "lucide-react";

interface ScarcityNoticeProps {
  remainingCount: number;
  onClose?: () => void;
}

export function ScarcityNotice({ remainingCount, onClose }: ScarcityNoticeProps) {
  if (remainingCount <= 0) return null;
  
  const getMessage = () => {
    if (remainingCount === 1) {
      return "Only 1 task left today. Don't miss out!";
    } else {
      return `Only ${remainingCount} tasks left today. Don't miss out!`;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="rounded-lg p-3 flex items-center justify-between danger-gradient text-white depth-shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          duration: 0.3,
        }}
      >
        <div className="flex items-center text-sm font-medium">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 shadow-inner">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold">{getMessage()}</p>
            <p className="text-xs text-white/80 mt-0.5">Complete tasks now before they expire</p>
          </div>
        </div>

        {onClose && (
          <motion.button
            onClick={onClose}
            className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label="Dismiss notification"
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18"></path>
              <path d="M6 6l12 12"></path>
            </svg>
          </motion.button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
