"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  CalendarIcon, 
  ChevronRightIcon, 
  IndianRupee, 
  LogOutIcon, 
  UserIcon, 
  InfoIcon, 
  ShieldIcon,
  Trophy,
  Star,
  Flame,
  Sparkles,
  Award,
  Zap,
  Lock,
  Check,
  ListTodo,
  Users,
  Medal,
  Target,
  Gift,
  TrendingUp,
  Settings,
  BellIcon,
  HelpCircle
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  // User information - in a real app this would come from an API/state
  const [user, setUser] = useState({
    name: 'Ashwin Singh',
    phone: '+91 9876543210',
    email: 'ashwin@example.com',
    joinDate: '2 weeks ago',
    totalEarned: 235,
    tasksCompleted: 12,
    level: 4,
    xp: 740,
    nextLevelXp: 1000,
    badges: [
      { id: 1, name: "Task Master", description: "Complete 10 tasks", icon: <Trophy size={16} />, color: "bg-amber-500" },
      { id: 2, name: "Early Bird", description: "First 100 users", icon: <Star size={16} />, color: "bg-indigo-500" },
      { id: 3, name: "Streak Keeper", description: "7-day streak", icon: <Flame size={16} />, color: "bg-orange-500" },
      { id: 4, name: "Influencer", description: "Refer 5 friends", icon: <Users size={16} />, color: "bg-purple-500", locked: true },
    ],
    achievements: [
      { id: 1, name: "Complete 10 tasks", progress: 100, reward: "10 XP", completed: true, category: "task" },
      { id: 2, name: "Refer 5 friends", progress: 60, reward: "50 XP", completed: false, category: "social" },
      { id: 3, name: "7-day streak", progress: 85, reward: "100 XP", completed: false, category: "streak" },
      { id: 4, name: "Earn ₹200", progress: 100, reward: "15 XP", completed: true, category: "earnings" },
      { id: 5, name: "Complete a survey", progress: 100, reward: "5 XP", completed: true, category: "task" },
      { id: 6, name: "First withdrawal", progress: 0, reward: "20 XP", completed: false, category: "earnings" },
    ],
    stats: [
      { name: "Tasks Completed", value: 12, icon: <ListTodo size={18} className="text-blue-500" /> },
      { name: "Earnings", value: "₹235", icon: <IndianRupee size={18} className="text-green-500" /> },
      { name: "Level", value: 4, icon: <TrendingUp size={18} className="text-purple-500" /> },
      { name: "Referrals", value: 3, icon: <Users size={18} className="text-amber-500" /> },
    ]
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });
  const [activeTab, setActiveTab] = useState('achievements');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real app, this would make an API call to update the profile
    setUser(prev => ({
      ...prev,
      name: formData.name,
      email: formData.email,
    }));

    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleLogout = () => {
    // In a real app, this would make an API call to log the user out
    toast.success("Logging out...");
    // Redirect to home page or clear auth state
  };

  // Calculate progress percentage
  const progressPercentage = (user.xp / user.nextLevelXp) * 100;
  
  // Filter achievements based on completion status
  const completedAchievements = user.achievements.filter(ach => ach.completed);
  const inProgressAchievements = user.achievements.filter(ach => !ach.completed);

  return (
    <div className="w-full px-3 py-4 space-y-5 pb-24">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <p className="text-sm text-muted-foreground">
          Track your journey and achievements
        </p>
      </div>

      {/* Profile Card with Progress */}
      <Card className="shadow-card overflow-hidden border-0 w-full">
        <CardContent className="p-0">
          {/* Top Banner with Level - Black gradient background */}
          <div className="relative">
            <div className="bg-gradient-to-r from-gray-900 to-black h-32 w-full">
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="flex justify-around items-center h-full">
                  {[...Array(6)].map((_, i) => (
                    <Trophy key={i} size={i % 2 === 0 ? 24 : 16} className="text-white" />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Level Indicator - Top right */}
            <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm py-1 px-3 rounded-full border border-white/20">
              <div className="flex items-center gap-1">
                <Trophy size={14} className="text-yellow-400" />
                <span className="text-xs font-bold text-white">Level {user.level}</span>
              </div>
            </div>
            
            {/* Avatar with XP Ring */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
              <div className="relative">
                {/* XP Progress Ring */}
                <svg className="w-32 h-32" viewBox="0 0 100 100">
                  {/* Background ring */}
                  <circle 
                    cx="50" cy="50" r="46" 
                    fill="none" 
                    stroke="#e2e2e2" 
                    strokeWidth="4"
                  />
                  {/* Progress ring */}
                  <circle 
                    cx="50" cy="50" r="46" 
                    fill="none" 
                    stroke="#333333" 
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="289"
                    strokeDashoffset={289 - (289 * progressPercentage / 100)}
                    transform="rotate(-90 50 50)"
                  />
                  
                  {/* Level markers */}
                  {[...Array(8)].map((_, i) => {
                    const angle = (i * 45) * (Math.PI / 180);
                    const x = 50 + 46 * Math.cos(angle);
                    const y = 50 + 46 * Math.sin(angle);
                    return (
                      <circle 
                        key={i} 
                        cx={x} cy={y} r="2" 
                        fill={i < user.level ? "#333333" : "#E0E0E0"} 
                      />
                    );
                  })}
                </svg>
                
                {/* Avatar */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    <AvatarFallback className="text-2xl bg-gray-800 text-white">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                {/* XP Badge */}
                <div className="absolute -right-2 bottom-2 bg-gray-900 text-white py-1 px-2 rounded-lg shadow-lg text-xs font-bold flex items-center gap-1">
                  <Zap size={12} className="text-yellow-400" />
                  {user.xp} XP
                </div>
              </div>
            </div>
          </div>
          
          {/* User Info */}
          <div className="pt-20 pb-4 px-4 text-center">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{user.phone}</p>
            <div className="flex items-center justify-center gap-1 mt-1 text-xs text-muted-foreground">
              <CalendarIcon className="w-3 h-3" />
              <span>Joined {user.joinDate}</span>
            </div>
            
            {/* XP Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Level {user.level}</span>
                <span>Level {user.level + 1}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-gray-800 to-gray-600 rounded-full"
                />
              </div>
              <p className="text-xs text-center mt-1 text-muted-foreground">
                {user.xp} / {user.nextLevelXp} XP to next level
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-2 mt-6">
              {user.stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="mx-auto w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                    {stat.icon}
                  </div>
                  <p className="font-bold text-sm">{stat.value}</p>
                  <p className="text-xs text-gray-500 truncate">{stat.name}</p>
                </div>
              ))}
            </div>
            
            {/* Edit Profile Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="mt-6 w-full rounded-lg border-gray-200"
            >
              <UserIcon className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs for Achievements/Badges */}
      <Card className="shadow-card border-0">
        <CardHeader className="pb-0">
          <Tabs defaultValue="achievements" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full bg-gray-100">
              <TabsTrigger value="achievements" className="rounded-md">
                <Target size={16} className="mr-2" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="badges" className="rounded-md">
                <Medal size={16} className="mr-2" />
                Badges
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="achievements" className="mt-4 space-y-4">
              {/* Completed Achievements */}
              {completedAchievements.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium flex items-center gap-2 px-1">
                    <Check size={16} className="text-green-600" />
                    Completed
                  </h3>
                  
                  <div className="space-y-2">
                    {completedAchievements.map(achievement => (
                      <div key={achievement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{achievement.name}</p>
                            <div className="flex items-center mt-1">
                              <Badge variant="outline" className="bg-gray-100 border-0 text-xs text-gray-700">
                                {achievement.reward}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* In Progress Achievements */}
              {inProgressAchievements.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium flex items-center gap-2 px-1">
                    <TrendingUp size={16} className="text-blue-600" />
                    In Progress
                  </h3>
                  
                  <div className="space-y-2">
                    {inProgressAchievements.map(achievement => (
                      <div key={achievement.id} className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            {achievement.category === 'task' ? (
                              <ListTodo className="w-4 h-4 text-blue-600" />
                            ) : achievement.category === 'social' ? (
                              <Users className="w-4 h-4 text-purple-600" />
                            ) : achievement.category === 'streak' ? (
                              <Flame className="w-4 h-4 text-orange-600" />
                            ) : (
                              <IndianRupee className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <p className="font-medium text-sm">{achievement.name}</p>
                              <Badge variant="outline" className="bg-amber-50 border-0 text-xs text-amber-700">
                                {achievement.reward}
                              </Badge>
                            </div>
                            
                            <div className="mt-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-500">{achievement.progress}% complete</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div 
                                  className="h-full rounded-full bg-blue-500"
                                  style={{ width: `${achievement.progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="badges" className="pt-2">
              <div className="grid grid-cols-2 gap-3">
                {user.badges.map(badge => (
                  <div 
                    key={badge.id} 
                    className={`p-4 rounded-lg border flex flex-col items-center text-center gap-2 relative ${
                      badge.locked ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100 shadow-sm'
                    }`}
                  >
                    {badge.locked && (
                      <div className="absolute inset-0 backdrop-blur-[1px] bg-white/60 rounded-lg flex items-center justify-center">
                        <div className="bg-gray-800/80 text-white rounded-full p-2">
                          <Lock size={18} />
                        </div>
                      </div>
                    )}
                    
                    <div className={`w-14 h-14 rounded-full ${badge.color} flex items-center justify-center`}>
                      <div className="text-white">
                        {badge.icon}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{badge.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
      
      {/* Account Settings */}
      <Card className="shadow-card border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Settings size={16} />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <BellIcon size={18} className="text-gray-600" />
                <span className="text-sm">Notifications</span>
              </div>
              <ChevronRightIcon size={18} className="text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <ShieldIcon size={18} className="text-gray-600" />
                <span className="text-sm">Privacy</span>
              </div>
              <ChevronRightIcon size={18} className="text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <HelpCircle size={18} className="text-gray-600" />
                <span className="text-sm">Help & Support</span>
              </div>
              <ChevronRightIcon size={18} className="text-gray-400" />
            </button>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 hover:bg-rose-50 text-rose-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <LogOutIcon size={18} />
                <span className="text-sm">Logout</span>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
      
      {/* Profile Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsEditing(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="rounded-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-lg"
                  />
                </div>
                
                <div className="pt-2 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 cta-button"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
