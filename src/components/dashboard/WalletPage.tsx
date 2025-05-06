"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  CalendarIcon, 
  CheckCircle, 
  IndianRupee, 
  Wallet,
  Coins,
  CreditCard,
  BanknoteIcon,
  BarChart3,
  Clock,
  DollarSign,
  ArrowRight,
  Gift,
  Send
} from "lucide-react";
import { toast } from "sonner";

// Sample transaction history
const TRANSACTION_HISTORY = [
  {
    id: '1',
    type: 'earning',
    description: 'YouTube - Watch Product Review',
    amount: 5,
    date: '2 hours ago',
    status: 'completed',
  },
  {
    id: '2',
    type: 'earning',
    description: 'Instagram - Follow @fashiontrends',
    amount: 10,
    date: 'Yesterday',
    status: 'completed',
  },
  {
    id: '3',
    type: 'earning',
    description: 'Survey - Shopping Preferences',
    amount: 15,
    date: '2 days ago',
    status: 'completed',
  },
  {
    id: '4',
    type: 'referral',
    description: 'Referral Bonus - Priya',
    amount: 5,
    date: '1 day ago',
    status: 'completed',
  },
  {
    id: '5',
    type: 'withdrawal',
    description: 'Withdrawal to UPI',
    amount: 200,
    date: '5 days ago',
    status: 'completed',
  },
];

// Payment methods
const PAYMENT_METHODS = [
  { id: 'upi', name: 'UPI', icon: <CreditCard size={20} className="text-blue-500" />, popular: true },
  { id: 'paytm', name: 'Paytm', icon: <Wallet size={20} className="text-indigo-500" /> },
  { id: 'bank', name: 'Bank Transfer', icon: <BanknoteIcon size={20} className="text-green-500" /> },
];

export default function WalletPage() {
  const [upiId, setUpiId] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');

  // Mock wallet balance - in a real app this would come from an API
  const walletBalance = 125;
  const withdrawableBalance = walletBalance;
  const canWithdraw = withdrawableBalance >= 200;
  const totalEarned = 235; // Total lifetime earnings
  const pendingEarnings = 15; // Earnings being processed
  const totalWithdrawn = 110; // Total amount withdrawn

  const handleWithdraw = () => {
    if (!canWithdraw) {
      toast.error("You need at least ₹200 to withdraw");
      return;
    }

    if (!upiId && selectedPaymentMethod === 'upi') {
      toast.error("Please enter your UPI ID");
      return;
    }

    // In a real app, this would make an API call to process the withdrawal
    toast.success("Withdrawal request submitted!");
  };

  // Filter transactions based on active tab
  const filteredTransactions = activeTab === 'all'
    ? TRANSACTION_HISTORY
    : TRANSACTION_HISTORY.filter(tx => tx.type === activeTab);

  // Calculations for earnings chart
  const todayEarnings = 25;
  const weeklyEarnings = 75;
  const monthlyEarnings = 235;

  return (
    <div className="container max-w-md mx-auto px-4 py-4 space-y-5 pb-24">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Your Wallet</h1>
        <p className="text-sm text-muted-foreground">
          Manage your earnings and withdrawals
        </p>
      </div>

      {/* Main Balance Card */}
      <Card className="shadow-card overflow-hidden border-0">
        <CardContent className="p-0">
          {/* Top Balance Area */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
              <Coins size={120} />
            </div>
            
            <div className="space-y-1">
              <p className="text-white/80 text-sm">Current Balance</p>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold mr-1">₹</span>
                <span className="text-3xl font-bold">{walletBalance}</span>
              </div>
              
              {!canWithdraw && (
                <div className="text-xs text-amber-200 flex items-center gap-1 mt-1">
                  <Clock size={12} />
                  <span>Need ₹{200 - withdrawableBalance} more to withdraw</span>
                </div>
              )}
            </div>
            
            {/* Progress to withdrawal threshold */}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/80">Withdrawal progress</span>
                <span className="text-white/80">₹{walletBalance}/₹200</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(walletBalance / 200) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-500"
                />
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-3 border-t border-gray-200">
            <div className="p-3 text-center border-r border-gray-200">
              <p className="text-xs text-gray-500">Total Earned</p>
              <p className="text-lg font-bold money-text flex items-center justify-center gap-1">
                <IndianRupee className="w-3 h-3" />
                {totalEarned}
              </p>
            </div>
            <div className="p-3 text-center border-r border-gray-200">
              <p className="text-xs text-gray-500">Withdrawn</p>
              <p className="text-lg font-bold flex items-center justify-center gap-1">
                <IndianRupee className="w-3 h-3" />
                {totalWithdrawn}
              </p>
            </div>
            <div className="p-3 text-center">
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-lg font-bold flex items-center justify-center gap-1 text-amber-500">
                <IndianRupee className="w-3 h-3" />
                {pendingEarnings}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earnings Summary Card */}
      <Card className="shadow-card border-0">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 size={18} className="text-green-600" />
              Earnings Summary
            </CardTitle>
            <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-0">
              This Month
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-500">Today</p>
              <p className="text-base font-bold money-text flex items-center justify-center">
                ₹{todayEarnings}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-500">This Week</p>
              <p className="text-base font-bold money-text flex items-center justify-center">
                ₹{weeklyEarnings}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-500">This Month</p>
              <p className="text-base font-bold money-text flex items-center justify-center">
                ₹{monthlyEarnings}
              </p>
            </div>
          </div>
          
          {/* Simplified bar chart */}
          <div className="mt-4 mb-2 flex items-end h-16 gap-1">
            {[30, 45, 25, 60, 40, 75, 55].map((height, index) => (
              <motion.div 
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t-sm"
                style={{ minHeight: '4px' }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Section */}
      <Card className="shadow-card border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Send size={18} className="text-blue-600" />
            Withdraw Money
          </CardTitle>
          <CardDescription>
            Minimum withdrawal amount is ₹200
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Payment method selection */}
          <div className="grid grid-cols-3 gap-2">
            {PAYMENT_METHODS.map(method => (
              <div 
                key={method.id}
                onClick={() => setSelectedPaymentMethod(method.id)}
                className={`p-3 rounded-lg border ${
                  selectedPaymentMethod === method.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white'
                } cursor-pointer transition-all relative`}
              >
                <div className="flex flex-col items-center text-center gap-1">
                  <div className="p-1.5 rounded-full bg-gray-100">
                    {method.icon}
                  </div>
                  <span className="text-xs font-medium">{method.name}</span>
                </div>
                
                {method.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-blue-500 text-[10px] px-1.5 py-0">
                    POPULAR
                  </Badge>
                )}
                
                {selectedPaymentMethod === method.id && (
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedPaymentMethod === 'upi' && (
            <div className="space-y-2">
              <Label htmlFor="upi">Your UPI ID</Label>
              <Input
                id="upi"
                placeholder="name@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="rounded-lg border-gray-200"
              />
            </div>
          )}

          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="w-full"
          >
            <Button
              onClick={handleWithdraw}
              disabled={!canWithdraw}
              className={`w-full rounded-lg cta-button py-3 flex items-center justify-center gap-2 ${!canWithdraw ? 'opacity-70' : ''}`}
            >
              Withdraw ₹{withdrawableBalance}
              <ArrowRight size={16} />
            </Button>
          </motion.div>

          {!canWithdraw && (
            <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-amber-800 font-medium text-sm">Insufficient balance</p>
                  <p className="text-amber-700 text-xs">
                    You need ₹{200 - withdrawableBalance} more to reach the minimum withdrawal amount of ₹200.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock size={18} className="text-gray-600" />
            Transaction History
          </h2>
        </div>

        {/* Transaction Type Tabs */}
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="all" className="rounded-md text-xs">All</TabsTrigger>
            <TabsTrigger value="earning" className="rounded-md text-xs">Earnings</TabsTrigger>
            <TabsTrigger value="withdrawal" className="rounded-md text-xs">Withdrawals</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-3">
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-card border-0">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            transaction.type === 'withdrawal'
                              ? 'bg-gray-100'
                              : transaction.type === 'referral'
                                ? 'bg-purple-100'
                                : 'bg-green-100'
                          }`}>
                            {transaction.type === 'withdrawal' ? (
                              <ArrowUpIcon className="w-4 h-4 text-gray-600" />
                            ) : transaction.type === 'referral' ? (
                              <Gift className="w-4 h-4 text-purple-600" />
                            ) : (
                              <ArrowDownIcon className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              {transaction.date}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            transaction.type === 'withdrawal'
                              ? 'text-gray-700'
                              : 'money-text'
                          }`}>
                            {transaction.type === 'withdrawal' ? '-' : '+'}
                            ₹{transaction.amount}
                          </p>
                          <Badge
                            variant="outline"
                            className={`${
                              transaction.type === 'withdrawal'
                                ? 'bg-gray-100 text-gray-800'
                                : transaction.type === 'referral'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-green-100 text-green-700'
                            } border-0 text-[10px]`}
                          >
                            {transaction.type.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              
              {filteredTransactions.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                    <Clock className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-gray-700 font-medium mb-1">No transactions yet</h3>
                  <p className="text-gray-500 text-sm">Complete tasks to start earning</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>
      
      {/* Trust Badges */}
      <section className="card-bg shadow-card rounded-lg p-4 text-center space-y-2">
        <h3 className="text-sm font-medium">Trusted by 50,000+ users</h3>
        <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-600" />
            UPI verified
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-600" />
            Real-time payouts
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-600" />
            24/7 Support
          </div>
        </div>
      </section>
    </div>
  );
}
