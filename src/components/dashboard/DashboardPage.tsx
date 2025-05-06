"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Home, User, PieChart, Users } from "lucide-react";

// Import components
import { WalletBalance } from "@/components/ui/wallet-balance";
import { WithdrawalProgress } from "@/components/ui/withdrawal-progress";
import { ActivityTicker } from "@/components/ui/activity-ticker";
import { StreakBanner } from "@/components/ui/streak-banner";
import { ScarcityNotice } from "@/components/ui/scarcity-notice";
import { RewardAnimation } from "@/components/ui/reward-animation";
import ImprovedTaskCard from "@/components/tasks/ImprovedTaskCard";

// Sample task data
const SAMPLE_TASKS = [
  {
    id: "1",
    platform: "youtube",
    title: "Subscribe to EarnIt Channel",
    description: "Watch for at least 30 seconds and subscribe",
    payout: 5,
    currency: "₹",
    url: "https://youtube.com/watch?v=sample1",
    timeEstimate: "20 seconds",
    remainingToday: 5
  },
  {
    id: "2",
    platform: "instagram",
    title: "Follow EarnIt Official",
    description: "Follow the profile and like recent post",
    payout: 10,
    currency: "₹",
    url: "https://instagram.com/sample_profile",
    timeEstimate: "15 seconds",
    remainingToday: 3
  },
  {
    id: "3",
    platform: "survey",
    title: "Quick Opinion Survey",
    description: "Answer 5 questions about shopping habits",
    payout: 15,
    currency: "₹",
    url: "https://surveylink.com/sample",
    timeEstimate: "2 minutes",
    remainingToday: 1
  },
];

// Sample activities
const SAMPLE_ACTIVITIES = [
  { id: "1", userName: "Ritika", location: "Mumbai", action: "earned ₹5 for subscribing" },
  { id: "2", userName: "Aman", location: "Delhi", action: "completed a survey task" },
  { id: "3", userName: "Rahul", location: "Bangalore", action: "withdrew ₹200" },
  { id: "4", userName: "Priya", location: "Chennai", action: "referred 3 friends" },
];

export default function DashboardPage() {
  const [balance, setBalance] = useState(125);
  const [streakDays, setStreakDays] = useState(3);
  const [showReward, setShowReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [tasksRemaining, setTasksRemaining] = useState(8);
  // Referral stats for the banner
  const [referralsCompleted, setReferralsCompleted] = useState(3);
  const [referralsRequired, setReferralsRequired] = useState(10);
  
  const handleTaskComplete = (amount: number) => {
    setRewardAmount(amount);
    setShowReward(true);
    setBalance((prev: number) => prev + amount);
    setTasksCompleted((prev: number) => prev + 1);
    setTasksRemaining((prev: number) => prev - 1);
    
    // Hide reward animation after 3 seconds
    setTimeout(() => {
      setShowReward(false);
    }, 3000);
  };

  return (
    <div className="w-full px-3 py-2 space-y-4 pb-16">
      {/* Header with Logo and Wallet */}
      <header className="flex justify-between items-center py-4 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">₹</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              EarnIt
            </h1>
            <p className="text-xs text-gray-500 -mt-1">Complete tasks and earn</p>
          </div>
        </div>
        <WalletBalance balance={balance} />
      </header>

      {/* Progress Bar */}
      <WithdrawalProgress currentAmount={balance} targetAmount={200} />
      
      {/* Streak Banner */}
      {streakDays > 0 && (
        <StreakBanner streakDays={streakDays} />
      )}
      
      {/* Activity Ticker */}
      <ActivityTicker activityItems={SAMPLE_ACTIVITIES} />
      
      {/* Referral Banner */}
      <Link href="/tasks?openReferral=true" className="block">
        <div className="card-gradient rounded-xl depth-shadow p-4 border-2 border-amber-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="tertiary-gradient rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Refer Friends & Earn</h3>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-600">{referralsCompleted}/{referralsRequired} completed</span>
                  <span className="text-xs ml-2 tertiary-gradient bg-clip-text text-transparent font-semibold">
                    Earn ₹{(referralsRequired - referralsCompleted) * 5} more!
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-full bg-amber-50 p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Scarcity Notice */}
      {tasksRemaining <= 5 && (
        <ScarcityNotice remainingCount={tasksRemaining} />
      )}
      
      {/* Daily Tasks Section */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-1">
            <span className="text-primary">🔥</span> Daily Tasks
          </h2>
          <Link href="/tasks" className="text-sm font-medium primary-gradient bg-clip-text text-transparent">
            View All
          </Link>
        </div>
        
        <div className="space-y-3">
          {SAMPLE_TASKS.map((task) => (
            <ImprovedTaskCard
              key={task.id}
              task={task}
              onClick={() => handleTaskComplete(task.payout)}
            />
          ))}
        </div>
      </section>
      
      {/* Trust Badges */}
      <section className="card-gradient rounded-lg depth-shadow p-4 text-center space-y-2 w-full">
        <h3 className="text-sm font-medium">Join our growing community</h3>
        <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="text-green-600">✓</span> Instant payouts
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-600">✓</span> 24/7 Support
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-600">✓</span> Secure platform
          </div>
        </div>
      </section>
      
      {/* "More Tasks" CTA Button */}
      <div className="py-4 text-center w-full">
        <Link href="/tasks" className="cta-button inline-block py-3 px-8 tap-animation w-full">
          More Tasks to Earn ₹
        </Link>
      </div>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white card-gradient border-t flex justify-around items-center py-2 px-2 z-10 depth-shadow w-full">
        <Link 
          href="/dashboard" 
          className="flex flex-col items-center primary-gradient bg-clip-text text-transparent tap-animation"
        >
          <Home size={20} />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link 
          href="/tasks" 
          className="flex flex-col items-center text-muted-foreground tap-animation"
        >
          <PieChart size={20} />
          <span className="text-xs">Tasks</span>
        </Link>
        <Link 
          href="/wallet" 
          className="flex flex-col items-center text-muted-foreground tap-animation"
        >
          <Bell size={20} />
          <span className="text-xs">Wallet</span>
        </Link>
        <Link 
          href="/profile" 
          className="flex flex-col items-center text-muted-foreground tap-animation"
        >
          <User size={20} />
          <span className="text-xs">Profile</span>
        </Link>
      </nav>
      
      {/* Reward Animation */}
      <AnimatePresence>
        {showReward && (
          <RewardAnimation amount={rewardAmount} show={showReward} />
        )}
      </AnimatePresence>
    </div>
  );
}
