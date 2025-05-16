"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get user from localStorage on initial load while waiting for Firebase
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.isAuthenticated) {
          // We don't set the actual user here, just acknowledge we have a logged-in state
          // The Firebase listener below will set the actual user object
        }
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }

    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // If user is logged in, update localStorage
      if (firebaseUser) {
        localStorage.setItem('user', JSON.stringify({
          uid: firebaseUser.uid,
          phoneNumber: firebaseUser.phoneNumber,
          isAuthenticated: true
        }));
      } else {
        // If no user but we had one in localStorage, clean it up
        if (localStorage.getItem('user')) {
          localStorage.removeItem('user');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
} 