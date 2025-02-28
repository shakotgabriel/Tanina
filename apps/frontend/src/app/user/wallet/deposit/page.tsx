"use client"

import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Wallet, Phone, Building2, CreditCard } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useCurrentUser } from "@/hooks/use-auth"
import { useWallet } from "@/hooks/use-wallet"
import { BalanceCard } from "@/components/wallet/BalanceCard"
import { DepositMethods } from "@/components/wallet/DepositMethods"

export default function DepositPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  const { data: user, isLoading: isLoadingUser } = useCurrentUser()
  const { data: wallet, isLoading: isLoadingWallet, error: walletError } = useWallet({
    enabled: !!user,
  })

  const handleDeposit = async () => {

  }

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6 bg-background min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-10 h-10 border-0 bg-muted hover:bg-muted/80"
            onClick={() => step > 1 ? setStep(step - 1) : router.back()}
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Top Up Money</h1>
        </div>

        <BalanceCard balance={0} />
        <DepositMethods />
      </div>
    </ScrollArea>
  )
}