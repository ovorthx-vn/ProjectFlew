"use client"

import * as React from 'react';
import type { User } from '@/lib/types';
import { users as initialUsers } from "@/lib/data"

type UserContextType = {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'avatar'>) => void;
  updateUser: (user: User) => void;
};

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = React.useState<User[]>(initialUsers);

  const addUser = (user: Omit<User, 'id' | 'avatar'>) => {
    const newIdSuffix = users.length + 1;
    const newUser: User = {
      ...user,
      id: `user-${newIdSuffix}`,
      avatar: `https://picsum.photos/seed/user${newIdSuffix}/40/40`,
    };
    setUsers(prev => [newUser, ...prev]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  return (
    <UserContext.Provider value={{ users, addUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
