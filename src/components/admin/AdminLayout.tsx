"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  Cog, 
  ClipboardList, 
  Users, 
  LogOut, 
  BarChart3,
  ChevronRight,
  Home,
  Menu,
  X
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        // Check if user is an admin
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().isAdmin) {
          setIsAdmin(true);
        } else {
          // Redirect non-admin users
          router.push("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    checkAdminStatus();
  }, [user, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden bg-white p-4 border-b border-gray-200 flex justify-between items-center">
        <h1 className="font-bold text-lg">Admin Panel</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <div 
        className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 
          transition-transform duration-200 ease-in-out
          fixed md:sticky top-0 left-0 z-40 md:z-0 h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto
        `}
      >
        <div className="p-4 border-b border-gray-200">
          <h1 className="font-bold text-xl">EarnIt Admin</h1>
          <p className="text-sm text-muted-foreground">Manage your platform</p>
        </div>

        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <Link 
                href="/admin" 
                className="flex items-center gap-2 p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Home size={18} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/tasks" 
                className="flex items-center gap-2 p-2 rounded-md text-gray-700 hover:bg-gray-100 bg-gray-100"
              >
                <ClipboardList size={18} />
                <span>Tasks</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/users" 
                className="flex items-center gap-2 p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Users size={18} />
                <span>Users</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/analytics" 
                className="flex items-center gap-2 p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <BarChart3 size={18} />
                <span>Analytics</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/settings" 
                className="flex items-center gap-2 p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Cog size={18} />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-between"
            onClick={handleLogout}
          >
            <span className="flex items-center gap-2">
              <LogOut size={16} />
              Logout
            </span>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Content area */}
        <main className="py-4 px-2 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
} 