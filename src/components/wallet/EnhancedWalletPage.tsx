"use client";

import { useState } from "react";
import { WalletInfoCard } from "@/components/wallet/WalletInfoCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ArrowDownIcon, ArrowUpIcon, Gift } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

// Sample transaction history (in a real app, this would come from Firestore)
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

export default function EnhancedWalletPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');

  // Filter transactions based on active tab
  const filteredTransactions = activeTab === 'all'
    ? TRANSACTION_HISTORY
    : TRANSACTION_HISTORY.filter(tx => tx.type === activeTab);

  return (
    <div className="w-full px-4 py-4 space-y-6 pb-24">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">My Wallet</h1>
        <p className="text-sm text-muted-foreground">
          Manage your wallet, earnings, and withdrawals
        </p>
      </div>

      {/* Wallet Info Card */}
      <WalletInfoCard />

      {/* Transaction History */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clock size={18} className="text-gray-600" />
          Transaction History
        </h2>

        {/* Transaction Type Tabs */}
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="all" className="rounded-md text-xs">All</TabsTrigger>
            <TabsTrigger value="earning" className="rounded-md text-xs">Earnings</TabsTrigger>
            <TabsTrigger value="withdrawal" className="rounded-md text-xs">Withdrawals</TabsTrigger>
            <TabsTrigger value="referral" className="rounded-md text-xs">Referrals</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-3">
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <Card key={transaction.id} className="shadow-sm border">
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
                          <p className="text-xs text-muted-foreground">
                            {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          transaction.type === 'withdrawal'
                            ? 'text-gray-700'
                            : 'text-green-600'
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
      <Card className="bg-gray-50 border">
        <CardContent className="py-4 text-center">
          <h3 className="text-sm font-medium mb-2">Secure Payments</h3>
          <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="text-green-600">✓</span> UPI Verified
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-600">✓</span> Instant transfers
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-600">✓</span> Secure payments
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 