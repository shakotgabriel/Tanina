import type { Metadata } from "next";

import "./globals.css";



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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="theme-color" content="#166534" />
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
    </head>
      <body>
        <div className="mobile-container">{children}</div>
        
      </body>
    </html>
  );
}