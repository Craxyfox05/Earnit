"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserData {
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  totalEarned: number;
  tasksCompleted: number;
  level: number;
  xp: number;
  nextLevelXp: number;
}

interface UserContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
}

const defaultUserData: UserData = {
  name: 'Ashwin Singh',
  email: 'ashwin@example.com',
  phone: '+91 9876543210',
  joinDate: '2 weeks ago',
  totalEarned: 235,
  tasksCompleted: 12,
  level: 4,
  xp: 740,
  nextLevelXp: 1000,
};

const UserContext = createContext<UserContextType>({
  userData: defaultUserData,
  updateUserData: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
}; 