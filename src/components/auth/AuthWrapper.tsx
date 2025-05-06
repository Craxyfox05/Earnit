"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

// In a real app, this would be a proper auth check with a token or session
const fakeAuthCheck = (): boolean => {
  // For demo purposes, we'll simulate being logged in
  // In a real app, check localStorage, cookies, or a state management solution
  return true; // Set to true to simulate logged in state for all pages
};

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = fakeAuthCheck();

    // If this is a protected route and user is not authenticated
    if (!isAuthenticated && pathname !== '/') {
      toast.error("Please login to access this page");
      router.push('/');
    }

    setIsLoading(false);
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
