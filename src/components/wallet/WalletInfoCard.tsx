"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface WalletData {
  userId: string;
  upiId: string;
  balance: number;
  totalEarned: number;
  totalWithdrawn: number;
  pendingWithdrawal: number;
  lastUpdated: any; // Firestore timestamp
}

export function WalletInfoCard() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [upiId, setUpiId] = useState("");
  const [savingUpi, setSavingUpi] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchWallet() {
      if (!user) return;
      
      try {
        const docRef = doc(db, "wallets", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const walletData = docSnap.data() as WalletData;
          setWallet(walletData);
          setUpiId(walletData.upiId || "");
        } else {
          setWallet(null);
        }
      } catch (error) {
        console.error("Error fetching wallet:", error);
        toast.error("Failed to load wallet information");
      } finally {
        setLoading(false);
      }
    }

    fetchWallet();
  }, [user]);

  const saveUpi = async () => {
    if (!user) return;
    
    if (!upiId.trim()) {
      toast.error("Please enter your UPI ID");
      return;
    }

    try {
      setSavingUpi(true);
      
      // If wallet doesn't exist, create one with default values
      if (!wallet) {
        await setDoc(doc(db, "wallets", user.uid), {
          userId: user.uid,
          upiId: upiId.trim(),
          balance: 0,
          totalEarned: 0,
          totalWithdrawn: 0,
          pendingWithdrawal: 0,
          lastUpdated: serverTimestamp()
        });
      } else {
        // Update existing wallet
        await setDoc(doc(db, "wallets", user.uid), {
          upiId: upiId.trim(),
          lastUpdated: serverTimestamp()
        }, { merge: true });
      }
      
      toast.success("UPI ID saved successfully");
      
      // Refresh wallet data
      const docRef = doc(db, "wallets", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setWallet(docSnap.data() as WalletData);
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving UPI ID:", error);
      toast.error("Failed to save UPI ID");
    } finally {
      setSavingUpi(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading wallet information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Your Wallet</CardTitle>
          </div>
          {wallet && wallet.upiId && !isEditing && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
            >
              Update UPI
            </Button>
          )}
        </div>
        <CardDescription>
          Manage your payment information and track your earnings
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {wallet ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-2xl font-bold">₹{wallet.balance || 0}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-muted-foreground">Total Earned</p>
                <p className="text-2xl font-bold">₹{wallet.totalEarned || 0}</p>
              </div>
            </div>
            
            {(isEditing || !wallet.upiId) ? (
              <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                <Label htmlFor="upi-id">Your UPI ID</Label>
                <Input
                  id="upi-id"
                  placeholder="yourname@bank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
                <div className="flex gap-2">
                  {isEditing && (
                    <Button variant="outline" onClick={() => {
                      setIsEditing(false);
                      setUpiId(wallet.upiId || "");
                    }}>
                      Cancel
                    </Button>
                  )}
                  <Button onClick={saveUpi} disabled={savingUpi}>
                    {savingUpi ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Save UPI ID
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 border rounded-lg">
                <Label className="text-sm text-muted-foreground">UPI ID</Label>
                <p className="font-medium">{wallet.upiId}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Last updated: {wallet.lastUpdated?.toDate().toLocaleString()}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <Wallet className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <h3 className="font-medium">No wallet found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Please add your UPI ID to set up your wallet
              </p>
              <div className="space-y-3">
                <Label htmlFor="new-upi-id">Your UPI ID</Label>
                <Input
                  id="new-upi-id"
                  placeholder="yourname@bank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
                <Button onClick={saveUpi} disabled={savingUpi} className="w-full">
                  {savingUpi ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating wallet...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Create Wallet
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      {wallet && (
        <CardFooter className="border-t pt-4 flex justify-between">
          <div className="grid grid-cols-2 w-full gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Withdrawn</p>
              <p className="font-medium">₹{wallet.totalWithdrawn || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="font-medium">₹{wallet.pendingWithdrawal || 0}</p>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
} 