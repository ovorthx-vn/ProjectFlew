"use client"
import * as React from 'react';

import type {Metadata} from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import { users as initialUsers } from "@/lib/data"
import type { User } from "@/lib/types"

// export const metadata: Metadata = {
//   title: 'ProjectFlow',
//   description: 'Manage your projects with ease.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [users, setUsers] = React.useState<User[]>(initialUsers);
  
  const addUser = (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
    }
    setUsers(prev => [newUser, ...prev]);
  }

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  }
  
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { users, addUser, updateUser } as any);
    }
    return child;
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>ProjectFlow</title>
        <meta name="description" content="Manage your projects with ease." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider defaultTheme="dark" storageKey="projectflow-theme">
          {childrenWithProps}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
