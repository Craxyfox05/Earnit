"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";
import { Bell, Home, User, PieChart, Wallet, ListChecks, ArrowRight } from "lucide-react";

// Import components
import { WalletBalance } from "@/components/ui/wallet-balance";
import { WithdrawalProgress } from "@/components/ui/withdrawal-progress";
import { CompletedTasks } from "@/components/dashboard/CompletedTasks";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardWithCompletedTasks() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>({});
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      if (!user) return;

      try {
        // Fetch user data
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }

        // Fetch wallet data
        const walletDoc = await getDoc(doc(db, "wallets", user.uid));
        if (walletDoc.exists()) {
          const walletData = walletDoc.data();
          setBalance(walletData.balance || 0);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user]);

  if (!user) {
    return (
      <div className="w-full px-4 py-6 space-y-6">
        <Card className="bg-gray-50 border-gray-100">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold">Welcome to EarnIt</h2>
            <p className="text-muted-foreground mt-2">Please log in to view your dashboard</p>
            <Link href="/login">
              <Button className="mt-4">Log In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-2 space-y-6 pb-16">
      {/* Header with User Welcome */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Hello, {userData.displayName || "there"}! 👋
          </p>
        </div>
        <WalletBalance balance={balance} />
      </div>

      {/* Wallet Status */}
      <WithdrawalProgress currentAmount={balance} targetAmount={200} />

      {/* Tabs for different sections */}
      <Tabs defaultValue="completed" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="completed" className="text-sm">Completed Tasks</TabsTrigger>
          <TabsTrigger value="stats" className="text-sm">Stats & Rewards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="completed" className="space-y-4">
          <CompletedTasks />
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-gray-50 border-gray-100">
              <CardContent className="pt-4 flex flex-col items-center text-center">
                <p className="text-3xl font-bold text-green-600">{userData.completedTasks || 0}</p>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50 border-gray-100">
              <CardContent className="pt-4 flex flex-col items-center text-center">
                <p className="text-3xl font-bold text-amber-600">₹{userData.totalEarnings || 0}</p>
                <p className="text-sm text-muted-foreground">Total Earned</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Referral Stats */}
          <Card className="border-amber-100">
            <CardContent className="pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Referral Earnings</h3>
                  <p className="text-sm text-muted-foreground">Invite friends and earn</p>
                </div>
                <Link href="/refer">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    Invite <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="bg-amber-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-amber-600">{userData.referredCount || 0}</p>
                  <p className="text-xs text-muted-foreground">Friends Referred</p>
                </div>
                
                <div className="bg-amber-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-amber-600">₹{(userData.referredCount || 0) * 5}</p>
                  <p className="text-xs text-muted-foreground">Referral Earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/tasks">
          <Button variant="default" className="w-full">Browse Tasks</Button>
        </Link>
        
        <Link href="/wallet">
          <Button variant="outline" className="w-full">View Wallet</Button>
        </Link>
      </div>
    </div>
  );
} 