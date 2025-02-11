"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowUpRight, Handshake, Receipt, MoreHorizontal, Search, Bell, Plus, ArrowRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useWallet, useTransactions } from "@/hooks/use-wallet"
import { useCurrentUser } from "@/hooks/use-auth"
import { formatCurrency, formatDate } from "@/lib/utils"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { BalanceCard } from "@/components/wallet/BalanceCard"
import { QuickActions } from "@/components/dashboard/QuickActions"

export default function MobileDashboardPage() {
 
  const { data: user, isLoading: isLoadingUser } = useCurrentUser()
  // Enable real-time updates with refetchInterval
  const { data: wallet, isLoading: isLoadingWallet, error: walletError } = useWallet({
    enabled: !!user,
  })

  const { 
    data: transactions, 
    isLoading: isLoadingTransactions, 
    error: transactionsError 
  } = useTransactions(10, {
    enabled: !!user,
  })

  const isLoading = isLoadingUser || isLoadingWallet || isLoadingTransactions

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user || walletError || transactionsError) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>
            {walletError?.message || transactionsError?.message || "Failed to load dashboard data"}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Calculate monthly spending if we have transactions
  const currentMonth = new Date().getMonth();
  const currentMonthTransactions = transactions?.filter(t => {
    const transactionMonth = new Date(t.createdAt).getMonth();
    return transactionMonth === currentMonth && t.type === 'DEBIT';
  }) || [];
  
  const monthlySpending = currentMonthTransactions.reduce((total, t) => total + t.amount, 0);
  const monthlyTarget = 5000; // This should come from user settings in the future
  const spendingProgress = Math.min((monthlySpending / monthlyTarget) * 100, 100);

  return (
    <ScrollArea className="h-screen">
      <div className="container p-4 pb-24 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.email || 'U'}`} />
              <AvatarFallback>{user?.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <p className="font-semibold">{user?.firstName || user?.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>

     
        <BalanceCard balance={wallet?.balance || 0} />
        <QuickActions />

        {/* Monthly Spending */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Monthly Spending</h2>
            <p className="text-sm text-muted-foreground">
              Target: {formatCurrency(monthlyTarget)}
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm font-medium">
                    {formatCurrency(monthlySpending)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {spendingProgress.toFixed(0)}%
                  </p>
                </div>
                <Progress value={spendingProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/user/transactions" className="flex items-center">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {transactions && transactions.length > 0 ? (
              transactions.map((transaction) => (
                <Card key={transaction.id} className="bg-card/50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className="rounded-full p-2 bg-primary/10">
                          {transaction.type === 'CREDIT' ? (
                            <ArrowUpRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-red-600 transform rotate-180" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {transaction.description || (
                              transaction.type === 'CREDIT' ? 'Money Received' : 'Money Sent'
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                      </div>
                      <p className={`font-medium ${
                        transaction.type === 'CREDIT' ? "text-green-600" : "text-red-600"
                      }`}>
                        {transaction.type === 'CREDIT' 
                          ? `+${formatCurrency(transaction.amount)}`
                          : `-${formatCurrency(transaction.amount)}`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No transactions yet
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}