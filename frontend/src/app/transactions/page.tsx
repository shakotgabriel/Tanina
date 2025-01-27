"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowDownLeft, ArrowUpRight, Receipt, Filter, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const mockTransactions = [
  {
    id: 1,
    type: "deposit",
    name: "Deposit from Bank",
    date: "27 Jan, 2025",
    time: "14:30",
    amount: 500.0,
    status: "completed",
    icon: "/logos/bank.png",
  },
  {
    id: 2,
    type: "withdrawal",
    name: "ATM Withdrawal",
    date: "26 Jan, 2025",
    time: "16:45",
    amount: 200.0,
    status: "completed",
    icon: "/logos/atm.png",
  },
  {
    id: 3,
    type: "transfer",
    name: "John Doe",
    date: "25 Jan, 2025",
    time: "09:15",
    amount: 150.0,
    status: "completed",
    icon: "/avatars/user-1.png",
  },
]

export default function TransactionsPage() {
  const [filter, setFilter] = React.useState("all")

  const filteredTransactions = React.useMemo(() => {
    if (filter === "all") return mockTransactions
    return mockTransactions.filter((t) => t.type === filter)
  }, [filter])

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-5 w-5 text-primary" />
      case "withdrawal":
        return <ArrowUpRight className="h-5 w-5 text-chart-3" />
      case "transfer":
        return <Receipt className="h-5 w-5 text-secondary" />
      default:
        return null
    }
  }

  const getAmountColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "text-primary"
      case "withdrawal":
        return "text-chart-3"
      case "transfer":
        return "text-secondary"
      default:
        return "text-foreground"
    }
  }

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6 bg-background min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 border-0 bg-muted hover:bg-muted/80">
              <ChevronLeft className="h-6 w-6 text-foreground" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Transactions</h1>
          </div>
          <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-0 bg-muted hover:bg-muted/80">
            <Filter className="h-5 w-5 text-foreground" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
          <TabsList className="grid w-full grid-cols-4 bg-muted rounded-2xl p-1">
            <TabsTrigger value="all" className="rounded-xl">
              All
            </TabsTrigger>
            <TabsTrigger value="deposit" className="rounded-xl">
              Deposits
            </TabsTrigger>
            <TabsTrigger value="withdrawal" className="rounded-xl">
              Withdrawals
            </TabsTrigger>
            <TabsTrigger value="transfer" className="rounded-xl">
              Transfers
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="shadow-sm border-0 rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar className="w-10 h-10 rounded-2xl overflow-hidden">
                      <AvatarImage src={transaction.icon} alt={transaction.name} />
                      <AvatarFallback className="bg-muted">{getTransactionIcon(transaction.type)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{transaction.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {transaction.date} | {transaction.time}
                      </p>
                    </div>
                  </div>
                  <p className={`font-medium ${getAmountColor(transaction.type)}`}>
                    {transaction.type === "deposit" ? "+" : "-"}${transaction.amount.toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}
