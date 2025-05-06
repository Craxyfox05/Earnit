"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  return (
    <div className="w-full px-3 py-4 space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold">Notifications</h1>
      </div>
      
      <Card className="shadow-sm border-0">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Push Notifications</h3>
              <p className="text-sm text-gray-500">Receive alerts on your device</p>
            </div>
            <div className="w-10 h-6 bg-green-500 rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Email Notifications</h3>
              <p className="text-sm text-gray-500">Get updates via email</p>
            </div>
            <div className="w-10 h-6 bg-gray-300 rounded-full relative">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Marketing Emails</h3>
              <p className="text-sm text-gray-500">Receive promotional offers</p>
            </div>
            <div className="w-10 h-6 bg-gray-300 rounded-full relative">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 