"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="w-full px-3 py-4 space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold">Privacy</h1>
      </div>
      
      <Card className="shadow-sm border-0">
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Privacy Policy</h3>
            <p className="text-sm text-gray-500">
              We respect your privacy and are committed to protecting your personal information.
              Our Privacy Policy explains how we collect, use, and safeguard your data when you use our app.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Data Collection</h3>
            <p className="text-sm text-gray-500">
              We collect minimal data to improve your experience. You can choose what data to share with us.
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Activity Tracking</h3>
              <p className="text-sm text-gray-500">Allow app to track your activity</p>
            </div>
            <div className="w-10 h-6 bg-green-500 rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 