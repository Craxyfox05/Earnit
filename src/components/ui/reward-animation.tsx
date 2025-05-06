"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Confetti } from "./confetti";

interface RewardAnimationProps {
  amount: number;
  show: boolean;
  currency?: string;
  message?: string;
  onComplete?: () => void;
}

export function RewardAnimation({
  amount,
  show,
  currency = "₹",
  message = "Great job!",
  onComplete,
}: RewardAnimationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [coinsCompleted, setCoinsCompleted] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const generateCoins = useCallback(() => {
    const coins = [];
    // Generate 10 coins with randomized positions
    for (let i = 0; i < 10; i++) {
      const randomX = Math.random() * 100 - 50; // -50 to 50
      const randomDelay = Math.random() * 0.4;
      const randomDuration = 0.8 + Math.random() * 0.6;
      const coinSize = 10 + Math.random() * 5; // Varied coin sizes

      coins.push(
        <motion.div
          key={i}
          className="absolute"
          initial={{ y: -20, x: randomX, opacity: 0, scale: 0, rotate: Math.random() * 180 - 90 }}
          animate={{
            y: 70,
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 1],
            x: randomX + (Math.random() * 40 - 20), // Add more horizontal movement
            rotate: Math.random() * 360 - 180, // Random rotation
          }}
          transition={{
            duration: randomDuration,
            delay: randomDelay,
            ease: "easeOut",
          }}
        >
          <div 
            className="flex items-center justify-center rounded-full primary-gradient text-white font-bold shadow-lg"
            style={{ width: `${coinSize}vw`, height: `${coinSize}vw`, maxWidth: '50px', maxHeight: '50px' }}
          >
            {currency}
          </div>
        </motion.div>
      );
    }
    return coins;
  }, [currency]);

  const handleAnimationComplete = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setAnimationComplete(true);
      if (onComplete) {
        onComplete();
      }
    }, 2000);
  }, [onComplete]);

  useEffect(() => {
    if (show) {
      setAnimationComplete(false);
      setShowConfetti(true);

      // Set coins as completed after 1.5 seconds
      timeoutRef.current = setTimeout(() => {
        setCoinsCompleted(true);
      }, 1500);
    } else {
      setShowConfetti(false);
      setCoinsCompleted(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [show]);

  if (!show && animationComplete) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <Confetti active={showConfetti} />

      <AnimatePresence>
        {show && !animationComplete && (
          <motion.div
            className="bg-black/70 backdrop-blur-md flex items-center justify-center rounded-xl p-8 shadow-xl max-w-sm mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onAnimationComplete={coinsCompleted ? handleAnimationComplete : undefined}
          >
            <div className="relative flex flex-col items-center text-white">
              {/* Coin container */}
              <div className="h-28 w-full relative flex items-center justify-center mb-6">
                {generateCoins()}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1] }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="absolute"
                >
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    <motion.svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="40" height="40" 
                      viewBox="0 0 24 24" 
                      className="text-white"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.9, duration: 0.6 }}
                    >
                      <path 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M20 6L9 17l-5-5"
                      />
                    </motion.svg>
                  </div>
                </motion.div>
              </div>

              {/* Main reward message */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="text-xl font-bold mb-2 flex items-center justify-center">
                  <motion.span
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="primary-gradient bg-clip-text text-transparent text-3xl"
                  >
                    +{currency}{amount}
                  </motion.span>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-white/80 text-lg">Added to your wallet</p>
                  <motion.p 
                    className="text-white/90 text-sm mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                  >
                    {message}
                  </motion.p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
