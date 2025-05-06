"use client";

import React, { useEffect, useState } from "react";
import { Progress } from "./progress";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Confetti } from "./confetti";

interface WithdrawalProgressProps {
  currentAmount: number;
  targetAmount: number;
  currency?: string;
  milestones?: number[];
  onMilestoneReached?: (milestone: number) => void;
}

export function WithdrawalProgress({
  currentAmount,
  targetAmount,
  currency = "₹",
  milestones = [50, 100, 200],
  onMilestoneReached,
}: WithdrawalProgressProps) {
  const [reachedMilestones, setReachedMilestones] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastMilestone, setLastMilestone] = useState<number | null>(null);

  // Calculate progress percentage
  const progress = Math.min(100, (currentAmount / targetAmount) * 100);

  // Check for newly reached milestones
  useEffect(() => {
    const newlyReached = milestones.filter(
      (milestone) => currentAmount >= milestone && !reachedMilestones.includes(milestone)
    );

    if (newlyReached.length > 0) {
      setReachedMilestones((prev) => [...prev, ...newlyReached]);
      setLastMilestone(Math.max(...newlyReached));
      setShowConfetti(true);

      // Notify the parent component
      if (onMilestoneReached) {
        for (const milestone of newlyReached) {
          onMilestoneReached(milestone);
        }
      }

      // Hide confetti after 3 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }
  }, [currentAmount, milestones, reachedMilestones, onMilestoneReached]);

  return (
    <div className="wallet-card space-y-2">
      {/* Display current progress text */}
      <div className="flex justify-between items-center text-sm font-medium">
        <span className="primary-gradient bg-clip-text text-transparent font-semibold">
          {currency}
          {currentAmount} / {currency}
          {targetAmount} to unlock withdrawal!
        </span>
        <span className="secondary-gradient bg-clip-text text-transparent font-bold">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress bar with milestone indicators */}
      <div className="relative">
        <div className="progress-bar-bg rounded-full overflow-hidden w-full h-3">
          <motion.div 
            className="progress-bar-fill h-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Milestone markers */}
        <div className="absolute inset-0 pointer-events-none">
          {milestones.map((milestone) => {
            const milestonePos = (milestone / targetAmount) * 100;
            const isReached = currentAmount >= milestone;

            return (
              <div
                key={milestone}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: `${milestonePos}%` }}
              >
                <motion.div
                  className={`flex items-center justify-center w-5 h-5 rounded-full -ml-2.5 ${
                    isReached ? "secondary-gradient depth-shadow" : "bg-white/90 border border-gray-200"
                  }`}
                  animate={isReached ? {
                    scale: [1, 1.2, 1],
                    boxShadow: ["0px 0px 0px rgba(62, 207, 142, 0)", "0px 0px 12px rgba(62, 207, 142, 0.6)", "0px 0px 4px rgba(62, 207, 142, 0.3)"]
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {isReached ? (
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  ) : (
                    <span className="text-[9px] font-bold text-foreground/80">
                      {currency}
                    </span>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badge that appears when milestone is reached */}
      <AnimatePresence>
        {lastMilestone && (
          <motion.div
            key={`milestone-${lastMilestone}`}
            className="rounded-lg secondary-gradient p-2 text-white text-sm font-medium flex items-center justify-center mt-2 trust-shadow"
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            <span>
              {currency}
              {lastMilestone} milestone reached! 🏅
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti effect when milestone is reached */}
      <Confetti active={showConfetti} />
    </div>
  );
}
