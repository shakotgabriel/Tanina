"use client"

import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Building2, Phone, Wallet } from "lucide-react"
import { useRouter } from 'next/navigation'

const withdrawMethods = [
  {
    id: 'bank',
    name: 'Bank Account',
    icon: <Building2 className="h-5 w-5" />,
    description: 'Withdraw to your bank account'
  },
  {
    id: 'mobile',
    name: 'Mobile Money',
    icon: <Phone className="h-5 w-5" />,
    description: 'Withdraw to mobile money'
  },
  {
    id: 'agent',
    name: 'Tanina Agent',
    icon: <Wallet className="h-5 w-5" />,
    description: 'Withdraw from nearby agent'
  }
];

export default function WithdrawPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [method, setMethod] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState<'idle' | 'processing'>('idle')

  const handleWithdraw = async () => {
    setStatus('processing')
    setTimeout(() => {
      setStatus('idle')
      router.push('/success')
    }, 2000)
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
          <h1 className="text-xl font-semibold text-foreground">Withdraw Money</h1>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <Card className="shadow-sm border-0 rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Available Balance</p>
                    <p className="text-2xl font-bold text-foreground">$2,588.00</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <h2 className="text-sm font-medium text-muted-foreground">Withdraw To</h2>
            <div className="grid gap-4">
              {withdrawMethods.map((method) => (
                <Button
                  key={method.id}
                  variant="ghost"
                  className="w-full bg-muted hover:bg-muted/80 rounded-2xl flex items-center gap-4 p-4 h-auto"
                  onClick={() => {
                    setMethod(method.id)
                    setStep(2)
                  }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    {method.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground">{method.name}</p>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <Card className="shadow-sm border-0 rounded-2xl">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Amount</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="text-2xl font-bold h-16 bg-muted border-0 rounded-xl text-center"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <p className="text-sm text-center text-muted-foreground">Available: $2,588.00</p>
                </div>

                {method === 'bank' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Bank Account</label>
                    <Input
                      placeholder="Enter account number"
                      className="bg-muted border-0 rounded-xl"
                    />
                  </div>
                )}

                {method === 'mobile' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Mobile Number</label>
                    <Input
                      placeholder="Enter mobile number"
                      className="bg-muted border-0 rounded-xl"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              className="w-full h-12 rounded-xl"
              disabled={!amount || status === 'processing'}
              onClick={handleWithdraw}
            >
              {status === 'processing' ? 'Processing...' : 'Withdraw Money'}
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}