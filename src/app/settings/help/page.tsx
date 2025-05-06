"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function HelpSupportPage() {
  return (
    <div className="w-full px-3 py-4 space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold">Help & Support</h1>
      </div>
      
      <Card className="shadow-sm border-0">
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Frequently Asked Questions</h3>
            <div className="rounded-lg border p-3 bg-gray-50">
              <p className="font-medium text-sm">How do I earn money?</p>
              <p className="text-xs text-gray-500 mt-1">
                Complete tasks like watching videos, filling surveys, and referring friends to earn money.
              </p>
            </div>
            
            <div className="rounded-lg border p-3 bg-gray-50">
              <p className="font-medium text-sm">When can I withdraw?</p>
              <p className="text-xs text-gray-500 mt-1">
                Once you reach ₹200, you can withdraw to your UPI or bank account.
              </p>
            </div>
            
            <div className="rounded-lg border p-3 bg-gray-50">
              <p className="font-medium text-sm">How do I refer friends?</p>
              <p className="text-xs text-gray-500 mt-1">
                Go to the Tasks page and tap on "Refer & Earn" to get your unique link.
              </p>
            </div>
          </div>
          
          <div className="pt-2">
            <Button className="w-full cta-button">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 