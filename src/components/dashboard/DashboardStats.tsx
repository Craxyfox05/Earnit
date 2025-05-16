"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  getWallet, 
  getUserTransactions, 
  subscribeToWallet,
  updateUserStreak,
  Wallet,
  Transaction
} from "@/lib/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Flame, Coins, ArrowUpRight, ArrowDownRight, Calendar, Users, Gift } from "lucide-react";

export function DashboardStats() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Get wallet data
        const userWallet = await getWallet(user.uid);
        if (userWallet) setWallet(userWallet);
        
        // Get recent transactions
        const userTransactions = await getUserTransactions(user.uid);
        setTransactions(userTransactions);
        
        // Update user streak
        const currentStreak = await updateUserStreak(user.uid);
        setStreak(currentStreak);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time listener for wallet changes
    const unsubscribeWallet = subscribeToWallet(user.uid, (updatedWallet) => {
      setWallet(updatedWallet);
    });

    return () => {
      unsubscribeWallet();
    };
  }, [user]);

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Calculate withdrawal progress percentage
  const calculateProgress = () => {
    if (!wallet) return 0;
    const progress = (wallet.balance / wallet.withdrawalThreshold) * 100;
    return Math.min(progress, 100);
  };

  // Format transaction date
  const formatTransactionDate = (timestamp: any) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);
    
    if (diffHrs < 1) {
      return 'Just now';
    } else if (diffHrs < 24) {
      return `${Math.floor(diffHrs)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <Skeleton className="h-[200px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Wallet Card */}
      <Card className="overflow-hidden shadow-sm border-0">
        <CardContent className="p-0">
          {/* Top Balance Area */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
              <Coins size={120} />
            </div>
            
            <div className="space-y-1">
              <p className="text-white/80 text-sm">Current Balance</p>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">
                  {wallet ? formatCurrency(wallet.balance) : '₹0'}
                </span>
              </div>
              
              {wallet && wallet.balance < wallet.withdrawalThreshold && (
                <div className="text-xs text-amber-200 flex items-center gap-1 mt-1">
                  <Calendar size={12} />
                  <span>Need {formatCurrency(wallet.withdrawalThreshold - wallet.balance)} more to withdraw</span>
                </div>
              )}
            </div>
            
            {/* Progress to withdrawal threshold */}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/80">Withdrawal progress</span>
                <span className="text-white/80">
                  {wallet ? `${formatCurrency(wallet.balance)}/${formatCurrency(wallet.withdrawalThreshold)}` : '₹0/₹200'}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-500"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-3 border-t border-gray-200">
            <div className="p-3 text-center border-r border-gray-200">
              <p className="text-xs text-gray-500">Total Earned</p>
              <p className="text-lg font-bold money-text">
                {wallet ? formatCurrency(wallet.totalEarned) : '₹0'}
              </p>
            </div>
            <div className="p-3 text-center border-r border-gray-200">
              <p className="text-xs text-gray-500">Withdrawn</p>
              <p className="text-lg font-bold">
                {wallet ? formatCurrency(wallet.totalWithdrawn) : '₹0'}
              </p>
            </div>
            <div className="p-3 text-center">
              <p className="text-xs text-gray-500">Streak</p>
              <div className="flex items-center justify-center gap-1">
                <Flame size={16} className="text-amber-500" />
                <p className="text-lg font-bold">{streak} days</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Transactions */}
      <Card className="shadow-sm border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 size={18} className="text-green-600" />
            Recent Transactions
          </CardTitle>
          <CardDescription>Your recent earnings and withdrawals</CardDescription>
        </CardHeader>
        
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">
              No transactions yet. Complete tasks to earn money!
            </p>
          ) : (
            <ul className="space-y-3">
              {transactions.map((tx) => (
                <li key={tx.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'earning' ? 'bg-green-50' : 
                      tx.type === 'withdrawal' ? 'bg-blue-50' : 
                      tx.type === 'referral' ? 'bg-purple-50' : 'bg-gray-50'
                    }`}>
                      {tx.type === 'earning' && <ArrowUpRight className="text-green-500" size={18} />}
                      {tx.type === 'withdrawal' && <ArrowDownRight className="text-blue-500" size={18} />}
                      {tx.type === 'referral' && <Users className="text-purple-500" size={18} />}
                      {tx.type === 'bonus' && <Gift className="text-amber-500" size={18} />}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTransactionDate(tx.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className={`font-semibold text-sm ${
                      tx.type === 'withdrawal' ? 'text-gray-600' : 'text-green-600'
                    }`}>
                      {tx.type === 'withdrawal' ? '-' : '+'}{formatCurrency(tx.amount)}
                    </span>
                    
                    <Badge 
                      variant={tx.status === 'completed' ? 'default' : 
                               tx.status === 'pending' ? 'outline' : 'destructive'}
                      className="text-[10px] px-1 mt-1 h-4"
                    >
                      {tx.status}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 