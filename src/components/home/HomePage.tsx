"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  ArrowUpRight, 
  Coins, 
  Flame, 
  Gift, 
  MonitorPlay, 
  Plus, 
  Sparkles, 
  Target, 
  Users, 
  Trophy,
  ChevronRight,
  Play,
  Clock,
  BarChart3,
  TrendingUp,
  MonitorCheck
} from "lucide-react";

// Mock user data - in a real app this would come from authentication
const USER = {
  name: "Ashwin",
  balance: 125,
  totalEarned: 235,
  streakDays: 3,
  withdrawalThreshold: 200,
  tasks: {
    completed: 12,
    available: 8
  }
};

// Sample earning methods with their descriptions
const EARNING_METHODS = [
  {
    id: "tasks",
    title: "Complete Tasks",
    description: "Watch videos, follow accounts, and more",
    icon: <Target size={20} className="text-blue-500" />,
    link: "/tasks",
    payout: "₹5-15 per task",
    color: "bg-blue-50",
    highlight: "HIGH PAYING"
  },
  {
    id: "ads",
    title: "Watch Ads",
    description: "Earn money by watching short video ads",
    icon: <MonitorPlay size={20} className="text-green-500" />,
    link: "/tasks?openAds=true",
    payout: "₹3 per ad",
    color: "bg-green-50",
    highlight: "EASY"
  },
  {
    id: "referrals",
    title: "Refer Friends",
    description: "Invite friends and earn for each referral",
    icon: <Users size={20} className="text-purple-500" />,
    link: "/tasks?openReferral=true",
    payout: "₹5 per friend",
    color: "bg-purple-50",
    highlight: "POPULAR"
  },
  {
    id: "surveys",
    title: "Complete Surveys",
    description: "Answer questions and share your opinion",
    icon: <BarChart3 size={20} className="text-amber-500" />,
    link: "/tasks",
    payout: "₹15-50 per survey",
    color: "bg-amber-50",
    highlight: "TOP PAYING"
  },
];

// Sample achievements to gamify the experience
const ACHIEVEMENTS = [
  {
    title: "First Day Bonus",
    description: "Complete at least one task today",
    icon: <Flame size={18} className="text-orange-500" />,
    reward: "₹25",
    progress: 65
  },
  {
    title: "Referral Champion",
    description: "Invite 5 friends to join",
    icon: <Users size={18} className="text-indigo-500" />,
    reward: "₹50",
    progress: 40
  }
];

export default function HomePage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  
  // Simulate that user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleSendOTP = () => {
    if (!phoneNumber.match(/^[6-9]\d{9}$/)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    // In a real app, we would call an API to send OTP
    setOtpSent(true);
    toast.success(`OTP sent to ${phoneNumber}`);
  };

  const handleVerifyOTP = () => {
    if (!otp.match(/^\d{6}$/)) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    // In a real app, we would verify the OTP with an API
    // For now, we'll simulate successful login
    toast.success("Login successful!");
    setIsLoginOpen(false);
    setIsLoggedIn(true);
  };

  // Calculate how much more needed to withdraw
  const remainingToWithdraw = Math.max(0, USER.withdrawalThreshold - USER.balance);

  return (
    <div className="container max-w-md mx-auto px-4 py-4 space-y-5 pb-20">
      {isLoggedIn ? (
        <>
          {/* User Greeting & Earnings Summary */}
          <section className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">
                  Hello, {USER.name}! 👋
                </h1>
                <p className="text-sm text-muted-foreground">Welcome back to EarnIt</p>
              </div>
              
              {/* Streak Badge */}
              <div className="bg-amber-50 rounded-full px-3 py-1 flex items-center gap-1 border border-amber-100">
                <Flame size={16} className="text-amber-500" />
                <span className="text-xs font-medium text-amber-700">{USER.streakDays} Day Streak</span>
              </div>
            </div>
            
            {/* Money SVG and Earnings Stats */}
            <Card className="overflow-hidden shadow-card border-0">
              <CardContent className="p-0">
                <div className="grid grid-cols-2">
                  {/* Left side: Wallet SVG */}
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 flex items-center justify-center">
                    <div className="relative">
                      {/* Wallet SVG */}
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="6" width="20" height="12" rx="2" fill="#2A9D72" />
                        <path d="M17 14C17.5523 14 18 13.5523 18 13C18 12.4477 17.5523 12 17 12C16.4477 12 16 12.4477 16 13C16 13.5523 16.4477 14 17 14Z" fill="#E2E2E2" />
                        <path d="M22 9H18C16.8954 9 16 9.89543 16 11V15C16 16.1046 16.8954 17 18 17H22V9Z" fill="#1A7B44" />
                        <rect x="6" y="3" width="12" height="3" rx="1" fill="#333333" />
                      </svg>
                      
                      {/* Animated coins */}
                      <motion.div 
                        className="absolute -right-2 -top-2"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" fill="#FFD54F" />
                          <circle cx="12" cy="12" r="8" fill="#FFCA28" />
                          <text x="9" y="16" fill="#333" fontWeight="bold" fontSize="10">₹</text>
                        </svg>
                      </motion.div>
                      
                      <motion.div 
                        className="absolute -left-4 top-2"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2, delay: 0.3, repeat: Infinity, repeatType: "reverse" }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" fill="#FFD54F" />
                          <circle cx="12" cy="12" r="8" fill="#FFCA28" />
                          <text x="9" y="16" fill="#333" fontWeight="bold" fontSize="10">₹</text>
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Right side: Stats */}
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-xs text-gray-600">Current Balance</p>
                      <div className="flex items-baseline">
                        <span className="text-xl font-bold money-text">₹{USER.balance}</span>
                        {remainingToWithdraw > 0 && (
                          <span className="text-xs text-gray-500 ml-2">
                            Need ₹{remainingToWithdraw} more to withdraw
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="h-px bg-gray-100"></div>
                    
                    <div>
                      <p className="text-xs text-gray-600">Total Earned</p>
                      <p className="text-lg font-bold money-text">₹{USER.totalEarned}</p>
                    </div>
                  </div>
                </div>
                
                {/* Quick Action Buttons */}
                <div className="grid grid-cols-2 border-t">
                  <Link href="/tasks" className="py-3 text-center border-r text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                    <Plus size={16} />
                    Earn More
                  </Link>
                  <Link href="/wallet" className="py-3 text-center text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                    <Coins size={16} />
                    Withdraw
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
          
          {/* Highlighted Ad Banner */}
          <motion.div 
            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 shadow-card"
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/tasks?openAds=true" className="flex items-center gap-3">
              <div className="accent-color rounded-full p-2 shadow-md">
                <Play size={18} className="text-white" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-0 text-xs mb-1">QUICK MONEY</Badge>
                    <h3 className="font-medium text-gray-800">Watch video ads & earn</h3>
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                      <Clock size={12} /> Under 1 minute per ad
                    </p>
                  </div>
                  <span className="money-text font-bold">+₹3</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
          </motion.div>
          
          {/* Ways to Earn Section */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              Ways to Earn
            </h2>
            
            <div className="space-y-3">
              {EARNING_METHODS.map(method => (
                <motion.div 
                  key={method.id}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href={method.link}>
                    <Card className="shadow-card hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`${method.color} p-2 rounded-full`}>
                            {method.icon}
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <Badge variant="outline" className="bg-gray-100 text-gray-700 border-0 text-xs mb-1">{method.highlight}</Badge>
                                <h3 className="font-medium text-gray-800">{method.title}</h3>
                                <p className="text-xs text-gray-600">{method.description}</p>
                              </div>
                              <span className="text-xs font-medium text-gray-700">{method.payout}</span>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
          
          {/* Daily Goals Section */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Trophy size={18} className="text-amber-500" />
              Today's Goals
            </h2>
            
            <Card className="shadow-card">
              <CardContent className="p-4 space-y-4">
                {ACHIEVEMENTS.map((achievement, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-2">
                        <div className="bg-gray-100 p-1.5 rounded-full">
                          {achievement.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{achievement.title}</h3>
                          <p className="text-xs text-gray-500">{achievement.description}</p>
                        </div>
                      </div>
                      <Badge className="bg-amber-50 text-amber-700 border-0">
                        {achievement.reward}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div 
                        className="primary-color h-1.5 rounded-full"
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
          
          {/* Success Stories */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" />
              Success Stories
            </h2>
            
            <div className="overflow-x-auto pb-2 -mx-4 px-4">
              <div className="flex gap-3">
                {[
                  { name: "Ritika", earned: "₹1,250", days: 14, location: "Mumbai" },
                  { name: "Aman", earned: "₹850", days: 10, location: "Delhi" },
                  { name: "Priya", earned: "₹1,500", days: 18, location: "Bangalore" }
                ].map((user, idx) => (
                  <Card key={idx} className="shadow-card min-w-[200px]">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.location}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">
                        Earned <span className="font-bold money-text">{user.earned}</span> in {user.days} days
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
          
          {/* Trust Badges */}
          <section className="card-bg shadow-card rounded-lg p-3 text-center space-y-2">
            <h3 className="text-sm font-medium">Trusted by 50,000+ users</h3>
            <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span> UPI verified
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span> Real-time payouts
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span> 24/7 Support
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Not Logged In View */}
          {/* Hero Section */}
          <section className="text-center space-y-3">
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent primary-gradient">
              EarnIt
            </h1>
            <h2 className="text-xl font-semibold text-foreground">
              Complete Tasks, Earn Real Money
            </h2>
            <p className="text-sm text-muted-foreground">
              The easiest way to earn money online by completing simple tasks
            </p>
          </section>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: "Quick Tasks", desc: "Takes less than 5 minutes", icon: <Clock size={24} className="text-blue-500" /> },
              { title: "Instant Payout", desc: "Directly to your UPI", icon: <Coins size={24} className="text-green-500" /> },
              { title: "Easy to Use", desc: "Simple & straightforward", icon: <MonitorCheck size={24} className="text-purple-500" /> },
              { title: "Track Progress", desc: "See your daily earnings", icon: <BarChart3 size={24} className="text-amber-500" /> }
            ].map((feature, idx) => (
              <Card key={idx} className="shadow-card">
                <CardContent className="p-3 flex flex-col items-center text-center space-y-1">
                  <div className="bg-gray-100 p-3 rounded-full mb-1">
                    {feature.icon}
                  </div>
                  <h3 className="font-medium text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Get Started Card */}
          <Card className="shadow-card primary-color border-0">
            <CardContent className="p-5 flex flex-col items-center gap-3">
              <h3 className="text-lg font-semibold text-center text-white">Ready to start earning?</h3>
              <p className="text-center text-white/80 text-sm">
                Sign up now and complete your first task in minutes!
              </p>
              <Button
                onClick={() => setIsLoginOpen(true)}
                size="lg"
                className="w-full bg-white text-gray-800 hover:bg-white/90"
              >
                Start Earning Now
              </Button>
            </CardContent>
          </Card>

          {/* Trust Badges */}
          <section className="card-bg shadow-card rounded-lg p-4 text-center space-y-2">
            <h3 className="text-sm font-medium">Trusted by 50,000+ users</h3>
            <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span> UPI verified
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span> Real-time payouts
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span> 24/7 Support
              </div>
            </div>
          </section>
        </>
      )}

      {/* Login/Signup Dialog */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="primary-color p-6">
            <DialogTitle className="text-2xl font-bold text-center text-white">
              {otpSent ? "Verify Your Number" : "Login to EarnIt"}
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-6">
            {!otpSent ? (
              // Phone Number Form
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="Enter your 10-digit phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <Button
                  onClick={handleSendOTP}
                  className="w-full"
                >
                  Send OTP
                </Button>
              </div>
            ) : (
              // OTP Verification Form
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="rounded-xl"
                  />
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    OTP sent to {phoneNumber}
                  </p>
                </div>
                <Button
                  onClick={handleVerifyOTP}
                  className="w-full"
                >
                  Verify & Login
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
