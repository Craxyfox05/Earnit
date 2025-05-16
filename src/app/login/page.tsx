"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PhoneLoginForm } from "@/components/auth/PhoneLoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft size={18} />
            <span className="font-medium">Back</span>
          </Link>
          <h1 className="mx-auto pr-8 text-lg font-semibold">Login</h1>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-3xl">₹</span>
            </div>
          </div>
          
          <PhoneLoginForm />
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              New to EarnIt? <Link href="/register" className="text-green-600 font-medium">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 