"use client"
import * as React from 'react';

import type {Metadata} from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from '@/context/user-context';
import { ProjectProvider } from '@/context/project-context';
import { FontProvider, useFont } from '@/context/font-context';
import { cn } from '@/lib/utils';

// export const metadata: Metadata = {
//   title: 'ProjectFlow',
//   description: 'Manage your projects with ease.',
// };

function AppBody({ children }: { children: React.ReactNode }) {
  const { font } = useFont();

  return (
    <body className={cn("font-body antialiased", font.variable)}>
      <ThemeProvider defaultTheme="dark" storageKey="projectflow-theme">
        <UserProvider>
          <ProjectProvider>
            {children}
          </ProjectProvider>
        </UserProvider>
        <Toaster />
      </ThemeProvider>
    </body>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>ProjectFlow</title>
        <meta name="description" content="Manage your projects with ease." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <FontProvider>
        <AppBody>{children}</AppBody>
      </FontProvider>
    </html>
  );
}
