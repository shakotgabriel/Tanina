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
      <body>
        {children}
      </body>
    </html>
  );
}