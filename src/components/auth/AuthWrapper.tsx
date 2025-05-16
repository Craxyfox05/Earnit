"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function AuthWrapper({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // If we're in the browser and still loading, show nothing
  if (!isClient || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If no user is found and we're not on the login page, redirect to login
  if (!user && pathname !== "/login" && isClient) {
    // Check localStorage as a backup (in case Firebase auth state not yet synced)
    const storedUser = localStorage.getItem('user');
    const isAuthenticated = storedUser ? JSON.parse(storedUser).isAuthenticated : false;
    
    if (!isAuthenticated) {
      router.push("/login");
      return null;
    }
  }

  return <>{children}</>;
}
