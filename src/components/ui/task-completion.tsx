"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";

interface TaskCompletionProps {
  isCompleting?: boolean;
  isCompleted?: boolean;
  animationDuration?: number;
  onAnimationComplete?: () => void;
}

export function TaskCompletion({
  isCompleting = false,
  isCompleted = false,
  animationDuration = 2500,
  onAnimationComplete,
}: TaskCompletionProps) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Show the animation when task is completed
    if (isCompleted) {
      setShowAnimation(true);

      // Hide the animation after duration
      const timeout = setTimeout(() => {
        setShowAnimation(false);
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, animationDuration);

      return () => clearTimeout(timeout);
    }
  }, [isCompleted, animationDuration, onAnimationComplete]);

  return (
    <AnimatePresence>
      {/* Loading spinner while completing */}
      {isCompleting && !isCompleted && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-card rounded-xl px-6 py-8 flex flex-col items-center space-y-4 max-w-xs mx-auto text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
            <h3 className="text-lg font-semibold">Verifying your task...</h3>
            <p className="text-sm text-muted-foreground">Please wait while we verify your task completion</p>
          </motion.div>
        </motion.div>
      )}

      {/* Success checkmark when task is completed */}
      {showAnimation && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-card rounded-xl px-6 py-8 flex flex-col items-center space-y-4 max-w-xs mx-auto text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.1, 1],
                opacity: 1,
              }}
              transition={{
                duration: 0.5,
                times: [0, 0.7, 1]
              }}
            >
              <CheckCircle className="w-14 h-14 text-success" />
            </motion.div>
            <motion.h3
              className="text-xl font-semibold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              ✅ Task Verified!
            </motion.h3>
            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Great job! Your reward will be added to your wallet
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
