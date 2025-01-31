"use client"
import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Bell, ArrowRight, Users, Store, Receipt, BarChart3, ArrowUpRight, Wallet, DollarSign, Ban } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

const recentTransactions = [
  {
    name: "Sarah Johnson",
    type: "Till Payment",
    date: "10 Dec",
    time: "09:30",
    amount: 150.00,
    status: "completed"
  },
  {
    name: "John Smith",
    type: "Bulk Transfer",
    date: "10 Dec",
    time: "10:15",
    amount: 2500.00,
    status: "pending"
  },
]

export default function BusinessDashboardPage() {
  const router = useRouter()

  return (
    <ScrollArea className="h-screen">
      <div className="p-4 space-y-4 bg-background min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                className="p-0"
                onClick={() => router.push('/business/profile')}
              >
                <Avatar className="w-10 h-10 rounded-xl">
                  <AvatarImage src="/store-logo.svg" />
                  <AvatarFallback>ST</AvatarFallback>
                </Avatar>
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="w-9 h-9 rounded-full border-0">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="w-9 h-9 rounded-full border-0">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <h1 className="text-xl font-semibold">Store Name</h1>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-primary text-primary-foreground rounded-2xl border-0">
            <CardContent className="p-4">
              <h2 className="text-xs font-medium mb-1">Today's Revenue</h2>
              <p className="text-2xl font-bold">$3,588</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3" />
                <span className="text-xs">+12.5%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary text-secondary-foreground rounded-2xl border-0">
            <CardContent className="p-4">
              <h2 className="text-xs font-medium mb-1">Balance</h2>
              <p className="text-2xl font-bold">$12,490</p>
              <div className="flex items-center gap-1 mt-1">
                
                <span className="text-xs">Available</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: <DollarSign className="h-5 w-5" />, label: "Receive", route: "/business/payments/receive" },
            { icon: <Users className="h-5 w-5" />, label: "Pay", route: "/business/payments/bulk-transfer" },
            { icon: <BarChart3 className="h-5 w-5" />, label: "Stats", route: "/business/analytics" },
            { icon: <Store className="h-5 w-5" />, label: "Store", route: "/business/store" }
          ].map((action) => (
            <Button
              key={action.label}
              variant="ghost"
              className="h-20 bg-muted rounded-xl flex flex-col items-center justify-center gap-1 p-0"
              onClick={() => router.push(action.route)}
            >
              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
                {action.icon}
              </div>
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="rounded-xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium">Customers</h3>
              </div>
              <p className="text-xl font-bold">1,234</p>
              <p className="text-xs text-muted-foreground">+22 this week</p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Receipt className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium">Orders</h3>
              </div>
              <p className="text-xl font-bold">156</p>
              <p className="text-xs text-muted-foreground">Today</p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">Recent Transactions</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full"
              onClick={() => router.push('/business/transactions')}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <Card key={tx.name} className="rounded-xl border-0">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <Wallet className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium truncate">{tx.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {tx.type} • {tx.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${tx.amount}</p>
                      <p className={`text-xs ${
                        tx.status === 'completed' ? 'text-green-500' : 'text-amber-500'
                      }`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}