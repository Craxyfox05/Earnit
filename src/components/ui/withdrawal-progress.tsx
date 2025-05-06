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

  // Calculate percentage
  const percentage = Math.min((currentAmount / targetAmount) * 100, 100);

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
    <div className="w-full space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="font-medium">Withdrawal Progress</span>
        <span className="text-gray-500">₹{currentAmount}/₹{targetAmount}</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-green-400 to-green-500"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      {currentAmount < targetAmount && (
        <p className="text-xs text-gray-500">
          Need ₹{targetAmount - currentAmount} more to withdraw
        </p>
      )}
    </div>
  );
}
