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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Share2Icon, UserIcon, CheckCircleIcon, CopyIcon } from "lucide-react";
import { toast } from "sonner";

// Sample referral data
const REFERRALS = [
  { id: '1', name: 'Aditya', initials: 'A', date: 'Just now', status: 'active', earned: 5 },
  { id: '2', name: 'Priya', initials: 'P', date: '1 day ago', status: 'active', earned: 5 },
  { id: '3', name: 'Rahul', initials: 'R', date: '3 days ago', status: 'active', earned: 5 },
  { id: '4', name: 'Sandeep', initials: 'S', date: '1 week ago', status: 'pending', earned: 0 },
];

export default function ReferralPage() {
  const [referralLink] = useState("https://earnit.com/ref/user123");

  // Stats
  const totalReferrals = REFERRALS.length;
  const activeReferrals = REFERRALS.filter(r => r.status === 'active').length;
  const totalEarned = REFERRALS.reduce((sum, r) => sum + r.earned, 0);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard!");
  };

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join me on EarnIt',
        text: 'Use my referral link to join EarnIt and start earning money by completing simple tasks!',
        url: referralLink,
      })
      .then(() => toast.success("Shared successfully!"))
      .catch(() => toast.error("Sharing failed"));
    } else {
      copyReferralLink();
    }
  };

  return (
    <div className="container px-4 py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Refer & Earn</h1>
        <p className="text-muted-foreground">
          Invite friends and earn ₹5 for each friend who joins
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="soft-shadow">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Invited</p>
            <p className="text-2xl font-bold mt-1">{totalReferrals}</p>
          </CardContent>
        </Card>

        <Card className="soft-shadow">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Active Users</p>
            <p className="text-2xl font-bold mt-1 text-primary">{activeReferrals}</p>
          </CardContent>
        </Card>

        <Card className="soft-shadow">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Earned</p>
            <p className="text-2xl font-bold mt-1 text-success">₹{totalEarned}</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link Card */}
      <Card className="soft-shadow accent-gradient border-0">
        <CardHeader className="text-white">
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription className="text-white/80">
            Share this link with friends to earn ₹5 for each sign-up
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              readOnly
              value={referralLink}
              className="bg-white/90 rounded-xl"
            />
            <Button
              onClick={copyReferralLink}
              variant="secondary"
              size="icon"
              className="bg-white hover:bg-white/80"
            >
              <CopyIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={shareReferralLink}
            className="w-full flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Share2Icon className="h-4 w-4" />
            Share with Friends
          </Button>
        </CardFooter>
      </Card>

      {/* How It Works */}
      <Card className="soft-shadow">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-primary-foreground">1</span>
            </div>
            <div>
              <h3 className="font-medium">Share your referral link</h3>
              <p className="text-sm text-muted-foreground">Send your unique link to friends</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-secondary-foreground">2</span>
            </div>
            <div>
              <h3 className="font-medium">Friend signs up</h3>
              <p className="text-sm text-muted-foreground">They create an account through your link</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-success-foreground">3</span>
            </div>
            <div>
              <h3 className="font-medium">You earn ₹5</h3>
              <p className="text-sm text-muted-foreground">When they complete their first task</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral List */}
      {REFERRALS.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Your Referrals</h2>
          <div className="space-y-3">
            {REFERRALS.map((referral) => (
              <Card key={referral.id} className="soft-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className={`${
                          referral.status === 'active'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {referral.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium flex items-center gap-1">
                          {referral.name}
                          {referral.status === 'active' && (
                            <CheckCircleIcon className="h-3 w-3 text-success" />
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          Joined {referral.date}
                        </p>
                      </div>
                    </div>

                    <div>
                      {referral.status === 'active' ? (
                        <Badge variant="outline" className="bg-success/10 text-success border-0">
                          +₹{referral.earned}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-secondary/20 text-secondary-foreground border-0">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
