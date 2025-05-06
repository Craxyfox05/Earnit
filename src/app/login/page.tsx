"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = phone entry, 2 = OTP verification
  const [loading, setLoading] = useState(false);
  
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };
  
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
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
          
          <h2 className="text-2xl font-bold text-center mb-6">Welcome to EarnIt</h2>
          
          {step === 1 ? (
            <div className="space-y-6">
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="phone">Mobile Number</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="cta-button w-full py-3 rounded-lg"
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Get OTP"}
                </button>
              </form>
              
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  New to EarnIt? <Link href="/register" className="text-green-600 font-medium">Create Account</Link>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="otp">Verification Code</label>
                  <input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    maxLength={6}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    OTP sent to +91 {phone}. <button type="button" className="text-green-600">Resend</button>
                  </p>
                </div>
                
                <button 
                  type="submit" 
                  className="cta-button w-full py-3 rounded-lg"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify & Log In"}
                </button>
              </form>
              
              <div className="text-center">
                <button 
                  type="button" 
                  className="text-green-600 font-medium"
                  onClick={() => setStep(1)}
                >
                  Change Phone Number
                </button>
              </div>
            </div>
          )}
          
          <div className="mt-10">
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-500 text-center">
                By logging in, you agree to our 
                <Link href="/terms" className="text-green-600"> Terms </Link>
                and
                <Link href="/privacy" className="text-green-600"> Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 