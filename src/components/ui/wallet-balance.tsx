"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IndianRupee } from "lucide-react";
import { Button } from "./button";
import { WithdrawalDialog } from "./withdrawal-dialog";

interface WalletBalanceProps {
  balance: number;
  onWithdrawal?: (amount: number, upiId: string) => void;
  minimumWithdrawal?: number;
}

export function WalletBalance({ 
  balance, 
  onWithdrawal,
  minimumWithdrawal = 200
}: WalletBalanceProps) {
  const [prevBalance, setPrevBalance] = useState(balance);
  const [isUpdated, setIsUpdated] = useState(false);
  
  useEffect(() => {
    if (balance !== prevBalance) {
      setIsUpdated(true);
      
      // Save the new balance as previous
      setPrevBalance(balance);
      
      // Reset the animation after 1.5 seconds
      const timer = setTimeout(() => {
        setIsUpdated(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [balance, prevBalance]);
  
  return (
    <div className="flex flex-col items-end">
      <div className="flex items-center gap-1.5 depth-shadow px-3 py-1.5 rounded-full card-gradient">
        <motion.div
          initial={{ scale: 1 }}
          animate={isUpdated ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
          className="flex items-center"
        >
          <div className="w-6 h-6 rounded-full primary-gradient flex items-center justify-center mr-1">
            <IndianRupee size={14} className="text-white" />
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={balance}
              initial={isUpdated ? { y: -20, opacity: 0 } : { opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`font-bold text-lg ${isUpdated ? "secondary-gradient bg-clip-text text-transparent" : "text-foreground"}`}
            >
              {balance}
            </motion.span>
          </AnimatePresence>
        </motion.div>
        
        {isUpdated && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="secondary-gradient text-white text-xs px-2 py-0.5 rounded-full font-medium"
          >
            +{balance - prevBalance}
          </motion.div>
        )}
      </div>
      
      <div className="mt-2">
        <WithdrawalDialog 
          balance={balance} 
          minimumWithdrawal={minimumWithdrawal}
          onWithdrawal={onWithdrawal}
        />
      </div>
    </div>
  );
}
