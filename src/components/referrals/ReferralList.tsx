"use client";

import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Referral {
  id: string;
  name: string;
  location: string;
  avatar: string;
  earnings: number;
  initials?: string;
  status?: "active" | "pending";
  date?: string;
}

interface ReferralListProps {
  referrals: Referral[];
  currency?: string;
  displayMode?: "grid" | "list" | "carousel";
  maxDisplay?: number;
}

export function ReferralList({
  referrals,
  currency = "₹",
  displayMode = "carousel",
  maxDisplay = 10,
}: ReferralListProps) {
  // Limit to max display
  const displayReferrals = [...referrals].slice(0, maxDisplay);

  // Get initials from name if not provided
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Display formats
  const renderReferrals = () => {
    switch (displayMode) {
      case "carousel":
      default:
        return (
          <div className="overflow-x-auto pb-2">
            <div className="flex space-x-3">
              {displayReferrals.map((referral, index) => (
                <motion.div
                  key={referral.id}
                  className="flex-shrink-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Avatar className="h-14 w-14 border-2 border-white shadow-sm relative">
                    {referral.avatar ? (
                      <AvatarImage src={referral.avatar} alt={referral.name} />
                    ) : null}
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {referral.initials || getInitials(referral.name)}
                    </AvatarFallback>

                    {/* Earnings indicator */}
                    <div className="absolute -bottom-1 -right-1 bg-success text-white text-[10px] rounded-full px-1 font-bold">
                      +{currency}{referral.earnings}
                    </div>
                  </Avatar>
                </motion.div>
              ))}
            </div>
            <div className="text-xs text-center text-muted-foreground mt-2">
              {displayReferrals.length > 0 ? (
                <>
                  <span className="font-medium">{displayReferrals[0].name}</span>
                  {displayReferrals.length > 1 && (
                    <> and {displayReferrals.length - 1} others joined using your link</>
                  )}
                </>
              ) : (
                <>Share your link to start earning referral rewards</>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderReferrals()}
    </div>
  );
}
