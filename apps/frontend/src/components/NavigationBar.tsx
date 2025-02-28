"use client"

import { Home, Wallet, Receipt, PieChart, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/transactions", icon: Wallet, label: "Transactions" },
  { href: "/bills", icon: Receipt, label: "Bills" },
  { href: "/insights", icon: PieChart, label: "Insights" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function NavigationBar() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-t-[1rem] shadow-lg">
      <nav className="flex justify-around items-center px-4 py-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 min-w-[4rem]",
                "transition-colors duration-200",
                isActive ? "text-green-600" : "text-gray-600 hover:text-green-600",
              )}
            >
              <Icon className={cn("w-6 h-6 mb-1", isActive && "text-green-600")} />
              <span className="text-xs font-medium">{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
