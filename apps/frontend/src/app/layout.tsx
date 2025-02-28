'use client'

import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { NavigationBar } from "@/components/NavigationBar";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, AuthContext } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const outfit = Outfit({ subsets: ["latin"] })
const queryClient = new QueryClient()

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useContext(AuthContext)
  const pathname = usePathname()
  const router = useRouter()
  const isAuthPage = pathname?.startsWith('/auth/')

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isAuthPage) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, isAuthPage, router])

  if (isLoading) {
    return (
      <main className="flex flex-col min-h-screen">
        <div className="mobile-container flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-col min-h-screen">
      <div className="mobile-container flex-1">{children}</div>
      {isAuthenticated && !isAuthPage && <NavigationBar />}
    </main>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={cn(outfit.className, "min-h-screen bg-background")}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RootLayoutContent>{children}</RootLayoutContent>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}