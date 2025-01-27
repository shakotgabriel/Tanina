import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { NavigationBar } from "@/components/NavigationBar";

const outfit = Outfit({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tanina - Digital Payment Platform",
  description: "Seamless digital payments and financial services",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tanina",
  },
};

export const viewport: Viewport = {
  themeColor: "#166534",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={cn(outfit.className, "min-h-screen bg-background")}>
        <main className="flex flex-col min-h-screen">
          <div className="mobile-container">{children}</div>
          <NavigationBar />
        </main>
      </body>
    </html>
  )
}