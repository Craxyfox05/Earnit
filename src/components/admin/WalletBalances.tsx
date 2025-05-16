"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Wallet {
  userId: string;
  upiId?: string;
  balance: number;
  totalEarned: number;
  totalWithdrawn: number;
  lastUpdated: any;
}

export default function WalletBalances() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallets();
  }, []);

  async function fetchWallets() {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "wallets"));
      const data = querySnapshot.docs.map((doc) => ({
        userId: doc.id,
        ...doc.data(),
      })) as Wallet[];
      
      setWallets(data);
    } catch (error) {
      console.error("Error fetching wallets:", error);
      toast.error("Failed to load wallet balances");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading wallets...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>💰 Wallet Balances ({wallets.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {wallets.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No wallets found
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {wallets.map((wallet) => (
              <div key={wallet.userId} className="p-4 border rounded-lg shadow-sm">
                <p className="font-medium text-sm mb-2 overflow-hidden text-ellipsis">
                  User ID: {wallet.userId}
                </p>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <p className="text-muted-foreground">Balance:</p>
                  <p className="font-semibold">₹{wallet.balance || 0}</p>
                  
                  <p className="text-muted-foreground">Total Earned:</p>
                  <p>₹{wallet.totalEarned || 0}</p>
                  
                  <p className="text-muted-foreground">Total Withdrawn:</p>
                  <p>₹{wallet.totalWithdrawn || 0}</p>
                  
                  {wallet.upiId && (
                    <>
                      <p className="text-muted-foreground">UPI ID:</p>
                      <p>{wallet.upiId}</p>
                    </>
                  )}
                  
                  <p className="text-muted-foreground">Last Updated:</p>
                  <p className="text-xs">
                    {wallet.lastUpdated?.toDate?.()?.toLocaleString() || 'Unknown'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 