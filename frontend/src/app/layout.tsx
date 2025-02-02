'use client'

import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { NavigationBar } from "@/components/NavigationBar";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext';

const outfit = Outfit({ subsets: ["latin"] })
const queryClient = new QueryClient()

// Move metadata and viewport to a separate metadata file since they can't be in client components
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={cn(outfit.className, "min-h-screen bg-background")}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <main className="flex flex-col min-h-screen">
              <div className="mobile-container">{children}</div>
              <NavigationBar />
            </main>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}