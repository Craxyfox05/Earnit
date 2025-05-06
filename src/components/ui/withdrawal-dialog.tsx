"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface WithdrawalDialogProps {
  balance: number;
  minimumWithdrawal: number;
  onWithdrawal?: (amount: number, upiId: string) => void;
}

export function WithdrawalDialog({ 
  balance, 
  minimumWithdrawal = 200,
  onWithdrawal
}: WithdrawalDialogProps) {
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState(balance.toString());
  const [isOpen, setIsOpen] = useState(false);
  
  const canWithdraw = balance >= minimumWithdrawal;
  
  const handleWithdraw = () => {
    if (!canWithdraw) {
      toast.error(`You need at least ₹${minimumWithdrawal} to withdraw`);
      return;
    }
    
    if (!upiId) {
      toast.error("Please enter your UPI ID");
      return;
    }
    
    const withdrawalAmount = parseInt(amount);
    
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (withdrawalAmount > balance) {
      toast.error("You cannot withdraw more than your balance");
      return;
    }
    
    // Call the onWithdrawal callback if provided
    if (onWithdrawal) {
      onWithdrawal(withdrawalAmount, upiId);
    }
    
    toast.success(`Withdrawal of ₹${withdrawalAmount} initiated!`);
    setIsOpen(false);
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={canWithdraw ? "default" : "outline"}
          className={canWithdraw ? "bg-success text-success-foreground hover:bg-success/90" : ""}
          disabled={!canWithdraw}
          onClick={() => canWithdraw && setIsOpen(true)}
        >
          Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="success-gradient p-6">
          <DialogTitle className="text-2xl font-bold text-center text-white">
            Withdraw Earnings
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-medium">Available Balance</h3>
            <p className="text-3xl font-bold text-success">₹{balance}</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Withdrawal Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <Input
                  id="amount"
                  type="text"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={handleAmountChange}
                  className="rounded-xl pl-7"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="upi">Your UPI ID</Label>
              <Input
                id="upi"
                placeholder="name@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                Your payment will be processed instantly to this UPI ID
              </p>
            </div>
            
            <Button
              onClick={handleWithdraw}
              className="w-full bg-success text-success-foreground hover:bg-success/90"
            >
              Withdraw Now
            </Button>
            
            <div className="flex justify-center gap-2 text-xs text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                <path d="m9 12 2 2 4-4"></path>
                <path d="M12 3c-1.2 0-2.4.6-3 1.7A3.6 3.6 0 0 0 4.6 9c-1 .6-1.7 1.8-1.7 3a4 4 0 0 0 4 4h4.6 0 0 1 .4 2 1 1 0 0 0 0 2 2 2 0 0 1 0 4"></path>
              </svg>
              <span>Most withdrawals are processed within 24 hours</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 