"use client";

import React from "react";
import { motion } from "framer-motion";

interface RewardAnimationProps {
  amount: number;
  show: boolean;
}

export function RewardAnimation({ amount, show }: RewardAnimationProps) {
  if (!show) return null;
  
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.5 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-green-500 text-white font-bold text-2xl px-6 py-3 rounded-xl shadow-lg flex items-center">
        <span className="text-yellow-300 mr-1">+</span>
        <span className="text-yellow-300 mr-1">₹</span>
        {amount}
      </div>
    </motion.div>
  );
}
