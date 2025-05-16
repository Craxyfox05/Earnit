"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, ArrowRight } from 'lucide-react';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: ConfirmationResult;
  }
}

export function PhoneLoginForm() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, step]);

  // Setup recaptcha verifier
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved, allow sending OTP
        },
        'expired-callback': () => {
          toast.error('reCAPTCHA expired. Please try again.');
          setLoading(false);
        }
      });
    }
  };

  // Send OTP to phone number
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!phoneNumber.trim()) {
      toast.error('Please enter a phone number');
      return;
    }
    
    // Format phone number
    let formattedPhone = phoneNumber;
    if (!formattedPhone.startsWith('+')) {
      // Assuming Indian number - you can adjust this logic for your region
      formattedPhone = `+91${formattedPhone.replace(/^0/, '')}`;
    }
    
    // Start loading
    setLoading(true);
    
    try {
      // Setup recaptcha
      setupRecaptcha();
      
      // Send OTP
      const confirmationResult = await signInWithPhoneNumber(
        auth, 
        formattedPhone, 
        window.recaptchaVerifier
      );
      
      // Store confirmation result
      window.confirmationResult = confirmationResult;
      
      // Move to OTP step
      setStep('otp');
      toast.success(`OTP sent to ${formattedPhone}`);
      setCountdown(60);
      setCanResend(false);
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast.error(error.message || 'Failed to send OTP. Please try again.');
      
      // Reset recaptcha
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined as any;
      }
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp.trim() || otp.length < 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    
    setLoading(true);
    
    try {
      // Verify OTP with Firebase
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;
      
      // Save user info to localStorage
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        phoneNumber: user.phoneNumber,
        isAuthenticated: true
      }));

      // Save user info to Firestore
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          // Create new user document if it doesn't exist
          await setDoc(userRef, {
            uid: user.uid,
            phoneNumber: user.phoneNumber,
            createdAt: serverTimestamp(),
            balance: 0,
            lastLogin: serverTimestamp()
          });
          toast.success('Account created successfully!');
        } else {
          // Update last login time for existing users
          await setDoc(userRef, {
            lastLogin: serverTimestamp()
          }, { merge: true });
        }
      } catch (firestoreError: any) {
        console.error('Error saving user data to Firestore:', firestoreError);
        toast.error('Login successful, but there was an issue saving your profile.');
        // We continue with the login flow even if Firestore save fails
      }
      
      toast.success('Login successful!');
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast.error(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = () => {
    if (canResend) {
      setOtp('');
      handleSendOTP(new Event('submit') as any);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Welcome to EarnIt</CardTitle>
        <CardDescription>
          {step === 'phone' 
            ? 'Enter your phone number to receive a verification code' 
            : 'Enter the verification code sent to your phone'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {step === 'phone' ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex">
                <div className="bg-muted flex items-center justify-center px-3 rounded-l-md border border-r-0 border-input">
                  +91
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your 10-digit number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="rounded-l-none"
                  maxLength={10}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                We'll send you a verification code via SMS
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Get Verification Code
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            
            {/* Recaptcha container */}
            <div id="recaptcha-container"></div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                className="text-center tracking-widest text-lg"
                required
              />
              
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  Didn't receive the code?
                </p>
                {countdown > 0 ? (
                  <p className="text-xs">Resend in {countdown}s</p>
                ) : (
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-xs" 
                    onClick={handleResendOTP}
                  >
                    Resend Code
                  </Button>
                )}
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify & Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2"
              onClick={() => setStep('phone')}
              disabled={loading}
            >
              Change Phone Number
            </Button>
          </form>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center pt-0">
        <p className="text-xs text-center text-muted-foreground">
          By continuing, you agree to our {' '}
          <a href="/terms" className="underline underline-offset-2 hover:text-primary">
            Terms of Service
          </a>
          {' '} and {' '}
          <a href="/privacy" className="underline underline-offset-2 hover:text-primary">
            Privacy Policy
          </a>
        </p>
      </CardFooter>
    </Card>
  );
} 