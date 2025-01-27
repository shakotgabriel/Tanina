import type { Metadata } from "next";
import { Outfit } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
// import { usePathname } from "next/navigation"
import { NavigationBar } from "@/components/NavigationBar";

const outfit = Outfit({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tanina - Digital Payment Platform",
  description: "Seamless digital payments and financial services",
  manifest: "/manifest.json",
  themeColor: "#166534",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tanina",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  //const pathname = usePathname()
  //const showNavigation = !["/login", "/signup", "/forgot-password"].includes(pathname)

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