"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowUpRight, Receipt, Search, Bell, Plus, ArrowRight, DollarSign, ArrowDownLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import Image from "next/image"

const recentTransactions = [
  {
    icon: "/icons/cash-in.png",
    type: "Cash In",
    customerName: "John Doe",
    date: "10 Dec, 2023",
    time: "09:30",
    amount: 500.0,
    status: "Pending",
  },
  {
    icon: "/icons/cash-out.png",
    type: "Cash Out",
    customerName: "Jane Smith",
    date: "10 Dec, 2023",
    time: "10:15",
    amount: 300.0,
    status: "Completed",
  },
]

export default function AgentDashboardPage() {
  const router = useRouter()

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6 bg-background min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="p-0 rounded-full" onClick={() => router.push("/agent/profile")}>
              <Avatar className="w-12 h-12 rounded-2xl overflow-hidden">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>AG</AvatarFallback>
              </Avatar>
            </Button>
            <div>
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <h1 className="text-lg font-semibold text-foreground">Agent Smith 👋</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 border-0 bg-muted hover:bg-muted/80"
            >
              <Search className="h-5 w-5 text-foreground" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 border-0 bg-muted hover:bg-muted/80"
            >
              <Bell className="h-5 w-5 text-foreground" />
            </Button>
          </div>
        </div>

        {/* Balance Card */}
        <Card className="bg-primary text-primary-foreground rounded-3xl border-none shadow-sm">
          <CardContent className="pt-6 pb-6">
            <h2 className="text-sm text-primary-foreground/80 mb-2">Your Cash Balance</h2>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">10,000.00 USD</p>
              <Button
                className="bg-background text-foreground hover:bg-accent rounded-xl"
                onClick={() => router.push("/agent/balance/top-up-request")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Request Top Up
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Deposit and Withdraw Buttons */}
        <div className="flex gap-4">
          <Button
            className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl h-14 text-lg font-semibold"
            onClick={() => router.push("/agent/deposit")}
          >
            <ArrowDownLeft className="h-6 w-6 mr-2" />
            Deposit
          </Button>
          <Button
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-14 text-lg font-semibold"
            onClick={() => router.push("/agent/withdraw")}
          >
            <ArrowUpRight className="h-6 w-6 mr-2" />
            Withdraw
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-3 overflow-auto pb-2 -mx-6 px-6">
          <Card className="shadow-sm border-0 rounded-2xl flex-shrink-0 w-[180px]">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-foreground mb-1">Today's Transactions</h3>
              <p className="text-2xl font-bold text-foreground">15</p>
              <p className="text-sm text-muted-foreground mt-1">5 Pending</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 rounded-2xl flex-shrink-0 w-[180px]">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-foreground mb-1">Today's Commission</h3>
              <p className="text-2xl font-bold text-foreground">$45.00</p>
              <p className="text-sm text-muted-foreground mt-1">+12% from yesterday</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="ghost"
            className="h-24 bg-muted hover:bg-muted/80 rounded-2xl flex flex-col items-center justify-center gap-2 p-0 border-0"
            onClick={() => router.push("/agent/transactions")}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm text-foreground">Transactions</span>
          </Button>

          <Button
            variant="ghost"
            className="h-24 bg-muted hover:bg-muted/80 rounded-2xl flex flex-col items-center justify-center gap-2 p-0 border-0"
            onClick={() => router.push("/agent/commissions")}
          >
            <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-chart-3" />
            </div>
            <span className="text-sm text-foreground">Commissions</span>
          </Button>

          <Button
            variant="ghost"
            className="h-24 bg-muted hover:bg-muted/80 rounded-2xl flex flex-col items-center justify-center gap-2 p-0 border-0"
            onClick={() => router.push("/agent/reports")}
          >
            <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
              <ArrowRight className="h-5 w-5 text-chart-4" />
            </div>
            <span className="text-sm text-foreground">Reports</span>
          </Button>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full hover:bg-muted/80 shadow-sm border border-border/5"
              onClick={() => router.push("/agent/transactions")}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <Card key={transaction.customerName} className="shadow-sm border-0 rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center overflow-hidden">
                        <Image
                          src={transaction.icon || "/placeholder.svg"}
                          alt={transaction.type}
                          width={24}
                          height={24}
                          className="w-6 h-6 rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{transaction.type}</h3>
                        <p className="text-sm text-muted-foreground">{transaction.customerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.date} | {transaction.time}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-medium text-foreground">${transaction.amount.toFixed(2)}</p>
                      <p
                        className={`text-sm ${transaction.status === "Pending" ? "text-yellow-500" : "text-green-500"}`}
                      >
                        {transaction.status}
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

