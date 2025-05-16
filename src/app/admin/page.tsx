"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { isUserAdmin } from "@/lib/adminFunctions";
import PendingTasksList from "@/components/admin/PendingTasksList";
import WalletBalances from "@/components/admin/WalletBalances";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      // Check if the user is an admin
      try {
        // Force token refresh to get the latest claims
        await user.getIdTokenResult(true);
        
        if (!isUserAdmin(user)) {
          router.push("/");
          return;
        }
        
        setUser(user);
      } catch (error) {
        console.error("Error checking admin status:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage tasks, users and wallet balances</p>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="tasks">Pending Tasks</TabsTrigger>
          <TabsTrigger value="wallets">Wallet Balances</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks">
          <PendingTasksList />
        </TabsContent>

        <TabsContent value="wallets">
          <WalletBalances />
        </TabsContent>
      </Tabs>
    </div>
  );
}
