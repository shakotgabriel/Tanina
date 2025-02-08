"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowDownLeft, ArrowUpRight, Receipt, Filter, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTransactions, useWallet } from "@/hooks/use-wallet"
import { ProtectedLayout } from "@/components/layouts/protected-layout"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"

export default function TransactionsPage() {
  const [filter, setFilter] = React.useState("all")
  const { data: transactions, isLoading } = useTransactions(50) // Load more transactions
  const { data: wallet } = useWallet()

  const filteredTransactions = React.useMemo(() => {
    if (!transactions) return []
    if (filter === "all") return transactions
    return transactions.filter((t) => {
      switch (filter) {
        case "deposit":
          return t.type === "CREDIT"
        case "withdrawal":
          return t.type === "DEBIT"
        default:
          return true
      }
    })
  }, [filter, transactions])

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "CREDIT":
        return <ArrowDownLeft className="h-5 w-5 text-primary" />
      case "DEBIT":
        return <ArrowUpRight className="h-5 w-5 text-chart-3" />
      default:
        return <Receipt className="h-5 w-5 text-secondary" />
    }
  }

  const getAmountColor = (type: string) => {
    switch (type) {
      case "CREDIT":
        return "text-primary"
      case "DEBIT":
        return "text-chart-3"
      default:
        return "text-foreground"
    }
  }

  return (
    <ProtectedLayout>
      <ScrollArea className="h-screen">
        <div className="p-6 space-y-6 bg-background min-h-screen">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-10 h-10 border-0 bg-muted hover:bg-muted/80"
                asChild
              >
                <Link href="/dashboard">
                  <ChevronLeft className="h-6 w-6 text-foreground" />
                </Link>
              </Button>
              <h1 className="text-lg font-semibold text-foreground">Transactions</h1>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 border-0 bg-muted hover:bg-muted/80"
            >
              <Filter className="h-5 w-5 text-foreground" />
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
            <TabsList className="grid w-full grid-cols-3 bg-muted rounded-2xl p-1">
              <TabsTrigger value="all" className="rounded-xl">
                All
              </TabsTrigger>
              <TabsTrigger value="deposit" className="rounded-xl">
                Deposits
              </TabsTrigger>
              <TabsTrigger value="withdrawal" className="rounded-xl">
                Withdrawals
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Transactions List */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No transactions found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className={`text-right ${getAmountColor(transaction.type)}`}>
                        <p className="font-medium">
                          {transaction.type === "CREDIT" ? "+" : "-"}
                          {formatCurrency(transaction.amount, wallet?.currency || "USD")}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {transaction.status.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </ProtectedLayout>
  )
}
