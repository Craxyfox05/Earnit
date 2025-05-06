"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RewardAnimation } from "@/components/ui/reward-animation";
import { ScarcityNotice } from "@/components/ui/scarcity-notice";
import ImprovedTaskCard from "@/components/tasks/ImprovedTaskCard";
import { ActivityTicker } from "@/components/ui/activity-ticker";
import { 
  UsersRound, 
  Share2, 
  ArrowRight, 
  Play, 
  MonitorPlay, 
  Video, 
  Check, 
  Target, 
  Flame, 
  Clock, 
  Filter, 
  BarChart3, 
  TrendingUp, 
  Gift, 
  Sparkles,
  ArrowUp,
  Medal,
  Trophy,
  Coins
} from "lucide-react";

// Mock user data - in a real app this would come from authentication
const USER = {
  name: "Ashwin",
  balance: 125,
  tasksCompleted: 12,
  tasksAvailable: 8,
  dailyGoal: 5,
  tasksToday: 3
};

// Sample referral data - in a real app this would come from API/database
const SAMPLE_REFERRALS = [
  { id: "r1", name: "Ritika", status: "completed", earnings: 5 },
  { id: "r2", name: "Aman", status: "completed", earnings: 5 },
  { id: "r3", name: "Rahul", status: "pending", earnings: 0 },
];

// Sample task data with more variety
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
    remainingToday: 5,
    category: "quickTask"
  },
  {
    id: "2",
    platform: "instagram",
    title: "Follow Fashion Brand",
    description: "Follow the profile and like recent post",
    payout: 10,
    currency: "₹",
    url: "https://instagram.com/sample_profile",
    timeEstimate: "15 seconds",
    remainingToday: 3,
    category: "quickTask"
  },
  {
    id: "3",
    platform: "survey",
    title: "Shopping Habits Survey",
    description: "Answer 5 questions about shopping preferences",
    payout: 15,
    currency: "₹",
    url: "https://surveylink.com/sample",
    timeEstimate: "2 minutes",
    remainingToday: 1,
    category: "survey"
  },
  {
    id: "4",
    platform: "youtube",
    title: "Watch Product Review",
    description: "Watch for at least 1 minute and like",
    payout: 7,
    currency: "₹",
    url: "https://youtube.com/watch?v=sample2",
    timeEstimate: "1 minute",
    remainingToday: 8,
    category: "quickTask"
  },
  {
    id: "5",
    platform: "instagram",
    title: "Like Fashion Post",
    description: "Like and save the post",
    payout: 6,
    currency: "₹",
    url: "https://instagram.com/post",
    timeEstimate: "10 seconds",
    remainingToday: 4,
    category: "quickTask"
  },
  {
    id: "6",
    platform: "survey",
    title: "Product Opinion Poll",
    description: "Share your thoughts on new products",
    payout: 12,
    currency: "₹",
    url: "https://surveylink.com/opinion",
    timeEstimate: "3 minutes",
    remainingToday: 2,
    category: "survey"
  },
  {
    id: "7",
    platform: "survey",
    title: "Financial Habits Study",
    description: "Complete survey about your money habits",
    payout: 25,
    currency: "₹",
    url: "https://surveylink.com/finance",
    timeEstimate: "5 minutes",
    remainingToday: 1,
    category: "highPaying"
  },
  {
    id: "8",
    platform: "tiktok",
    title: "Follow TikTok Creator",
    description: "Follow and engage with new content",
    payout: 8,
    currency: "₹",
    url: "https://tiktok.com/creator",
    timeEstimate: "40 seconds",
    remainingToday: 3,
    category: "quickTask"
  },
  {
    id: "9",
    platform: "survey",
    title: "Tech Product Research",
    description: "Give feedback on upcoming tech products",
    payout: 30,
    currency: "₹",
    url: "https://surveylink.com/tech",
    timeEstimate: "7 minutes",
    remainingToday: 1,
    category: "highPaying"
  }
];

// Sample activities
const SAMPLE_ACTIVITIES = [
  { id: "1", userName: "Ritika", location: "Mumbai", action: "earned ₹5 for subscribing" },
  { id: "2", userName: "Aman", location: "Delhi", action: "completed a survey task" },
  { id: "3", userName: "Rahul", location: "Bangalore", action: "withdrew ₹200" },
  { id: "4", userName: "Priya", location: "Chennai", action: "referred 3 friends" },
];

export default function TasksPage() {
  const searchParams = useSearchParams();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [showReward, setShowReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [tasksRemaining, setTasksRemaining] = useState(SAMPLE_TASKS.length);
  const [showReferralDetails, setShowReferralDetails] = useState(false);
  const [showAdsDetails, setShowAdsDetails] = useState(false);
  const [referralsCompleted, setReferralsCompleted] = useState(SAMPLE_REFERRALS.filter(r => r.status === "completed").length);
  const [adsWatched, setAdsWatched] = useState(0);
  const [activeTab, setActiveTab] = useState("all");

  // Check URL parameters
  useEffect(() => {
    const openReferral = searchParams.get("openReferral");
    if (openReferral === "true") {
      setShowReferralDetails(true);
    }
    
    const openAds = searchParams.get("openAds");
    if (openAds === "true") {
      setShowAdsDetails(true);
    }
  }, [searchParams]);

  // Constants for earning methods
  const TOTAL_REFERRALS_NEEDED = 10;
  const REFERRAL_PAYOUT_PER_PERSON = 5;
  const TOTAL_ADS_NEEDED = 15;
  const AD_PAYOUT_EACH = 3;
  
  // Handle task completion
  const handleTaskComplete = (taskId: string, amount: number) => {
    if (completedTasks.includes(taskId)) return;
    
    setRewardAmount(amount);
    setShowReward(true);
    setCompletedTasks([...completedTasks, taskId]);
    setTasksRemaining(prev => prev - 1);
    
    setTimeout(() => {
      setShowReward(false);
    }, 3000);
  };

  // Handler functions for various earning methods
  const handleReferralClick = () => setShowReferralDetails(true);
  const handleAdsClick = () => setShowAdsDetails(true);
  
  // Demo function for ad watching
  const watchAd = () => {
    if (adsWatched < TOTAL_ADS_NEEDED) {
      setAdsWatched(prev => prev + 1);
      setRewardAmount(AD_PAYOUT_EACH);
      setShowReward(true);
      setTimeout(() => {
        setShowReward(false);
      }, 3000);
    }
  };

  // Filter tasks based on selected tab
  const filteredTasks = (() => {
    const sortedTasks = [...SAMPLE_TASKS].sort((a, b) => b.payout - a.payout);
    
    switch(activeTab) {
      case "quick":
        return sortedTasks.filter(task => task.category === "quickTask");
      case "survey":
        return sortedTasks.filter(task => task.category === "survey");
      case "highPaying":
        return sortedTasks.filter(task => task.payout >= 15);
      case "youtube":
        return sortedTasks.filter(task => task.platform === "youtube");
      case "instagram":
        return sortedTasks.filter(task => task.platform === "instagram");
      case "tiktok":
        return sortedTasks.filter(task => task.platform === "tiktok");
      default:
        return sortedTasks;
    }
  })();

  // Progress calculations
  const referralProgress = (referralsCompleted / TOTAL_REFERRALS_NEEDED) * 100;
  const adsProgress = (adsWatched / TOTAL_ADS_NEEDED) * 100;
  const dailyGoalProgress = (USER.tasksToday / USER.dailyGoal) * 100;

  return (
    <div className="container max-w-md mx-auto px-4 py-4 space-y-4 pb-24">
      {/* User Greeting & Daily Goal */}
      <section className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Tasks Dashboard</h1>
            <p className="text-sm text-muted-foreground">Find tasks and earn rewards</p>
          </div>
          
          {/* Daily Goal Indicator */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-full px-3 py-1 flex items-center gap-1 border border-gray-200">
            <Target size={16} className="text-gray-700" />
            <span className="text-xs font-medium">{USER.tasksToday}/{USER.dailyGoal} Today</span>
          </div>
        </div>
        
        {/* Daily Progress */}
        <Card className="shadow-card border-0">
          <CardContent className="p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1.5">
                <Trophy size={14} className="text-amber-500" />
                <span className="text-sm font-medium">Daily Goal Progress</span>
              </div>
              <span className="text-xs bg-gradient-to-r from-amber-50 to-amber-100 px-2 py-0.5 rounded-full text-amber-700 border border-amber-200">
                {USER.tasksToday < USER.dailyGoal ? `${USER.dailyGoal - USER.tasksToday} more to go` : 'Completed!'}
              </span>
            </div>
            
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${dailyGoalProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
              />
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Activity Ticker */}
      <ActivityTicker activityItems={SAMPLE_ACTIVITIES} />
      
      {/* Low inventory notice */}
      {tasksRemaining <= 5 && (
        <ScarcityNotice remainingCount={tasksRemaining} />
      )}
      
      {/* Top Earning Methods */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Coins size={18} className="text-green-600" />
          Quick Ways to Earn
        </h2>
      
        {/* Referral Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-2"
        >
          {!showReferralDetails ? (
            <Card className="shadow-card overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-start p-4 gap-3">
                  <div className="flex-shrink-0">
                    <div className="black-gradient rounded-full p-2 shadow-lg" style={{
                      boxShadow: "0 2px 0 rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.1)",
                      border: "1px solid rgba(255,255,255,0.1)"
                    }}>
                      <UsersRound className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="flex-grow space-y-1">
                    <div className="flex justify-between items-start w-full">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">
                            SPECIAL OFFER
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                            {referralsCompleted}/{TOTAL_REFERRALS_NEEDED} DONE
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-base">Refer Friends & Earn Big</h3>
                        <p className="text-sm text-muted-foreground">Invite 10 friends and earn ₹5 for each successful referral.</p>
                        
                        {/* Progress bar */}
                        <div className="mt-2 mb-1">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="purple-gradient h-2.5 rounded-full transition-all duration-500 ease-out" 
                              style={{ 
                                width: `${referralProgress}%`, 
                                background: "linear-gradient(to right, #8B5CF6, #7C3AED)" 
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-right mt-1 text-gray-600">
                            Earned: <span className="money-text">₹{referralsCompleted * REFERRAL_PAYOUT_PER_PERSON}</span> of <span className="text-gray-600">₹{TOTAL_REFERRALS_NEEDED * REFERRAL_PAYOUT_PER_PERSON}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 ml-3">
                        <div className="flex flex-col items-end gap-1">
                          <span className="bg-purple-500 text-white font-bold shadow-button border-0 px-2.5 py-1 rounded-md flex items-center" style={{
                            boxShadow: "0 2px 0 rgba(107,33,168,0.4), 0 2px 5px rgba(0,0,0,0.1)",
                            border: "1px solid rgba(255,255,255,0.1)"
                          }}>
                            +₹{REFERRAL_PAYOUT_PER_PERSON}/friend
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 border-t">
                  <button
                    onClick={handleReferralClick}
                    className="w-full rounded-lg cta-button scale-on-tap transition-all border-0 py-2.5 flex items-center justify-center gap-2"
                  >
                    View Referral Details
                    <ArrowRight size={16} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Referral Details View - Keep existing implementation */
            <div className="rounded-xl wallet-card space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg primary-text flex items-center gap-2">
                  <UsersRound size={20} className="text-gray-600" />
                  Referral Program
                </h3>
                <button 
                  onClick={() => setShowReferralDetails(false)}
                  className="text-gray-500 rounded-full hover:bg-gray-100 p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18"></path>
                    <path d="M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="text-sm space-y-2">
                <p className="text-muted-foreground">
                  Invite friends to join EarnIt and earn ₹5 for each friend who joins and completes at least one task.
                </p>
                
                <div className="rounded-lg bg-gray-50 p-3 flex justify-between items-center shadow-inset">
                  <div>
                    <span className="text-sm font-medium">Your progress</span>
                    <div className="flex items-center gap-2 font-bold text-lg">
                      <span className="primary-text">
                        {referralsCompleted}/{TOTAL_REFERRALS_NEEDED}
                      </span>
                      <span className="text-gray-400">referrals</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">Earned</span>
                    <div className="font-bold text-lg money-text">
                      ₹{referralsCompleted * REFERRAL_PAYOUT_PER_PERSON}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Your Referral Link</h4>
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 p-2 rounded-lg text-xs flex-grow truncate shadow-inset">
                      https://earnit.app/join?ref=USER123
                    </div>
                    <button className="secondary-color rounded-full p-2 text-white shadow-button" onClick={() => alert("Link copied!")} style={{
                      boxShadow: "0 2px 0 rgba(0,0,0,0.1), 0 3px 8px rgba(0,0,0,0.1)"
                    }}>
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <h4 className="font-medium flex justify-between">
                    <span>Referral Status</span>
                    {/* For demo purposes - button to add referral */}
                    {referralsCompleted < TOTAL_REFERRALS_NEEDED && (
                      <button 
                        className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 shadow-sm" 
                        style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
                        onClick={() => {
                          setReferralsCompleted(prev => prev + 1);
                          setRewardAmount(REFERRAL_PAYOUT_PER_PERSON);
                          setShowReward(true);
                          setTimeout(() => {
                            setShowReward(false);
                          }, 3000);
                        }}
                      >
                        + Demo: Add Referral
                      </button>
                    )}
                  </h4>
                  <div className="space-y-2">
                    {SAMPLE_REFERRALS.map(referral => (
                      <div key={referral.id} className="flex items-center justify-between p-2 rounded-lg bg-white shadow-card">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
                            {referral.name.charAt(0)}
                          </div>
                          <span className="font-medium">{referral.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {referral.status === "completed" ? (
                            <>
                              <span className="text-green-600 text-xs">+₹{referral.earnings}</span>
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full" style={{
                                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                                border: "1px solid rgba(16,185,129,0.1)"
                              }}>
                                Completed
                              </span>
                            </>
                          ) : (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full" style={{
                                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                                border: "1px solid rgba(251,191,36,0.1)"
                              }}>
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* Show remaining slots */}
                    {Array.from({ length: TOTAL_REFERRALS_NEEDED - SAMPLE_REFERRALS.length }).map((_, idx) => (
                      <div key={`empty-${idx}`} className="flex items-center justify-between p-2 rounded-lg border border-dashed border-gray-200">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shadow-inset">
                            ?
                          </div>
                          <span className="text-gray-400">Empty slot</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          Invite someone
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => setShowReferralDetails(false)}
                  className="w-full rounded-lg secondary-color font-medium p-2.5 mt-2 shadow-button scale-on-tap" style={{
                    boxShadow: "0 2px 0 rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.1)",
                    border: "1px solid rgba(255,255,255,0.1)"
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Ad Watching Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-2"
        >
          {!showAdsDetails ? (
            <Card className="shadow-card overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-start p-4 gap-3">
                  <div className="flex-shrink-0">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full p-2 shadow-lg" style={{
                      boxShadow: "0 2px 0 rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.1)",
                      border: "1px solid rgba(255,255,255,0.1)"
                    }}>
                      <MonitorPlay className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="flex-grow space-y-1">
                    <div className="flex justify-between items-start w-full">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                            HIGH REWARD
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                            {adsWatched}/{TOTAL_ADS_NEEDED} DONE
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-base">Watch Ads & Earn Money</h3>
                        <p className="text-sm text-muted-foreground">Watch short video ads and earn ₹{AD_PAYOUT_EACH} for each ad viewed completely.</p>
                        
                        {/* Progress bar */}
                        <div className="mt-2 mb-1">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="h-2.5 rounded-full transition-all duration-500 ease-out" 
                              style={{ 
                                width: `${adsProgress}%`,
                                background: "linear-gradient(to right, #22C55E, #16A34A)" 
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-right mt-1 text-gray-600">
                            Earned: <span className="money-text">₹{adsWatched * AD_PAYOUT_EACH}</span> of <span className="text-gray-600">₹{TOTAL_ADS_NEEDED * AD_PAYOUT_EACH}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 ml-3">
                        <div className="flex flex-col items-end gap-1">
                          <span className="bg-green-500 text-white font-bold shadow-button border-0 px-2.5 py-1 rounded-md flex items-center" style={{
                            boxShadow: "0 2px 0 rgba(22,163,74,0.4), 0 2px 5px rgba(0,0,0,0.1)",
                            border: "1px solid rgba(255,255,255,0.1)"
                          }}>
                            +₹{AD_PAYOUT_EACH}/ad
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 border-t">
                  <button
                    onClick={handleAdsClick}
                    className="w-full rounded-lg cta-button scale-on-tap transition-all border-0 py-2.5 flex items-center justify-center gap-2"
                  >
                    View Ad Details
                    <ArrowRight size={16} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Ad Details View - Keep existing implementation */
            <div className="rounded-xl wallet-card space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg primary-text flex items-center gap-2">
                  <MonitorPlay size={20} className="text-gray-600" />
                  Watch Ads & Earn
                </h3>
                <button 
                  onClick={() => setShowAdsDetails(false)}
                  className="text-gray-500 rounded-full hover:bg-gray-100 p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18"></path>
                    <path d="M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="text-sm space-y-2">
                <p className="text-muted-foreground">
                  Watch short video ads (30-60 seconds) to earn ₹{AD_PAYOUT_EACH} for each completed view. Maximum {TOTAL_ADS_NEEDED} ads per day.
                </p>
                
                <div className="rounded-lg bg-gray-50 p-3 flex justify-between items-center shadow-inset">
                  <div>
                    <span className="text-sm font-medium">Your progress</span>
                    <div className="flex items-center gap-2 font-bold text-lg">
                      <span className="primary-text">
                        {adsWatched}/{TOTAL_ADS_NEEDED}
                      </span>
                      <span className="text-gray-400">ads watched</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">Earned</span>
                    <div className="font-bold text-lg money-text">
                      ₹{adsWatched * AD_PAYOUT_EACH}
                    </div>
                  </div>
                </div>

                {/* Available ads */}
                <div className="space-y-2 mt-4">
                  <h4 className="font-medium">Available Ads</h4>
                  <div className="space-y-2">
                    {/* Demo ads */}
                    {adsWatched < TOTAL_ADS_NEEDED && (
                      <div className="bg-white rounded-lg p-3 shadow-card">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="bg-green-100 p-2 rounded-lg">
                              <Video className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">Premium Ad</p>
                              <p className="text-xs text-gray-600">30 seconds • +₹{AD_PAYOUT_EACH}</p>
                            </div>
                          </div>
                          <button
                            onClick={watchAd}
                            className="accent-color px-3 py-1 rounded text-xs font-medium shadow-button flex items-center gap-1"
                            style={{
                              boxShadow: "0 2px 0 rgba(26,123,68,0.3), 0 2px 6px rgba(0,0,0,0.1)"
                            }}
                          >
                            <Play size={12} /> Watch
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* If all ads are watched */}
                    {adsWatched >= TOTAL_ADS_NEEDED && (
                      <div className="bg-gray-100 rounded-lg p-3 text-center">
                        <p className="text-gray-600">You've watched all available ads today!</p>
                        <p className="text-xs text-gray-500 mt-1">Check back tomorrow for more earning opportunities</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Watch history */}
                <div className="space-y-2 mt-4">
                  <h4 className="font-medium">Watch History</h4>
                  <div className="h-40 overflow-y-auto space-y-2 bg-gray-50 p-2 rounded-lg shadow-inset">
                    {Array.from({ length: adsWatched }).map((_, idx) => (
                      <div key={`ad-${idx}`} className="flex justify-between items-center bg-white p-2 rounded border border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="w-3 h-3 text-green-600" />
                          </div>
                          <span className="text-xs">Ad #{idx + 1}</span>
                        </div>
                        <span className="text-xs money-text">+₹{AD_PAYOUT_EACH}</span>
                      </div>
                    ))}
                    
                    {adsWatched === 0 && (
                      <div className="text-center py-6">
                        <p className="text-gray-400 text-xs">No ads watched yet</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setShowAdsDetails(false)}
                  className="w-full rounded-lg accent-color font-medium p-2.5 mt-2 shadow-button scale-on-tap" style={{
                    boxShadow: "0 2px 0 rgba(26,123,68,0.3), 0 4px 10px rgba(0,0,0,0.1)",
                    border: "1px solid rgba(255,255,255,0.1)"
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </section>
      
      {/* Featured Task Section */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles size={18} className="text-amber-500" />
          Featured Tasks
        </h2>
        
        {/* Task Filter Tabs */}
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="all" className="rounded-md text-xs">All</TabsTrigger>
            <TabsTrigger value="quick" className="rounded-md text-xs">Quick</TabsTrigger>
            <TabsTrigger value="survey" className="rounded-md text-xs">Surveys</TabsTrigger>
            <TabsTrigger value="highPaying" className="rounded-md text-xs">High Paying</TabsTrigger>
          </TabsList>
          
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm font-medium text-gray-700">
              {filteredTasks.length} Available
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Sort by:</span>
              <div className="flex bg-gray-100 rounded-lg p-0.5">
                <span className="text-xs px-2 py-1 bg-white rounded shadow-sm">Highest Paying</span>
                <span className="text-xs px-2 py-1 text-gray-600">Newest</span>
              </div>
            </div>
          </div>
          
          {/* Task Cards */}
          <TabsContent value={activeTab} className="mt-3">
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <ImprovedTaskCard
                  key={task.id}
                  task={task}
                  onClick={() => handleTaskComplete(task.id, task.payout)}
                  disabled={completedTasks.includes(task.id)}
                />
              ))}
              
              {filteredTasks.length === 0 && (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                    <Target className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-gray-700 font-medium mb-1">No tasks available</h3>
                  <p className="text-gray-500 text-sm">Try a different category or check back later</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>
      
      {/* More Ways to Earn */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Gift size={18} className="text-amber-600" />
          Special Offers
        </h2>
        
        {/* Mystery Task Card */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="shadow-card overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-start p-4 gap-3">
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-full p-2 shadow-lg" style={{
                    boxShadow: "0 2px 0 rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.1)",
                    border: "1px solid rgba(255,255,255,0.1)"
                  }}>
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="flex-grow space-y-1">
                  <div className="flex justify-between items-start w-full">
                    <div className="space-y-1">
                      <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">
                        SPECIAL EVENT
                      </Badge>
                      <h3 className="font-semibold text-base">Mystery Task</h3>
                      <p className="text-sm text-muted-foreground">Complete a random task for a surprise reward.</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <Clock className="w-3 h-3 mr-1" />
                        Refreshes in 2 hours
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 ml-3">
                      <div className="flex flex-col items-end gap-1">
                        <span className="bg-amber-500 text-white font-bold shadow-button border-0 px-2.5 py-1 rounded-md flex items-center" style={{
                          boxShadow: "0 2px 0 rgba(180,83,9,0.4), 0 2px 5px rgba(0,0,0,0.1)",
                          border: "1px solid rgba(255,255,255,0.1)"
                        }}>
                          ₹?
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 border-t">
                <Button className="w-full rounded-lg cta-button scale-on-tap transition-all border-0 py-2.5">
                  Reveal Mystery Task
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
      
      {/* Trust Badges */}
      <section className="card-bg shadow-card rounded-lg p-4 text-center space-y-2">
        <h3 className="text-sm font-medium">Trusted by 50,000+ users</h3>
        <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Verified tasks
          </div>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Instant approval
          </div>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Fast payouts
          </div>
        </div>
      </section>
      
      {/* Reward Animation */}
      <AnimatePresence>
        {showReward && (
          <RewardAnimation amount={rewardAmount} currency="₹" show={showReward} />
        )}
      </AnimatePresence>
    </div>
  );
}
