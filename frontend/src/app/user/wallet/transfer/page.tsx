"use client"

import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Wallet, Phone, Building2, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation'

const recentContacts = [
  {
    name: "Sarah Johnson",
    id: "tanina.12345",
    avatar: "/placeholder.svg"
  },
  {
    name: "Michael Chen",
    id: "tanina.67890",
    avatar: "/placeholder.svg"
  }
];

const transferMethods = [
  {
    id: 'wallet',
    name: 'To Wallet',
    icon: <Wallet className="h-5 w-5" />,
    description: 'Send to Tanina wallet'
  },
  {
    id: 'mobile',
    name: 'To Mobile Money',
    icon: <Phone className="h-5 w-5" />,
    description: 'Send to mobile money'
  },
  {
    id: 'bank',
    name: 'To Bank Account',
    icon: <Building2 className="h-5 w-5" />,
    description: 'Send to bank account'
  }
];

export default function TransferPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [method, setMethod] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState<'idle' | 'processing'>('idle')

  const handleTransfer = async () => {
    setStatus('processing')
    // Add transfer logic here
    setTimeout(() => {
      setStatus('idle')
      router.push('/success') // Create a success page
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
          <h1 className="text-xl font-semibold text-foreground">Send Money</h1>
        </div>

        {step === 1 && (
          <>
            {/* Search Recipients */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10 bg-muted border-0 rounded-xl"
                placeholder="Search name or wallet ID"
              />
            </div>

            {/* Recent Contacts */}
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-muted-foreground">Recent</h2>
              <div className="grid gap-4">
                {recentContacts.map((contact) => (
                  <Button
                    key={contact.id}
                    variant="ghost"
                    className="w-full bg-muted hover:bg-muted/80 rounded-2xl flex items-center gap-4 p-4 h-auto"
                    onClick={() => setStep(2)}
                  >
                    <Avatar className="w-12 h-12 rounded-2xl">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback>{contact.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="font-medium text-foreground">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.id}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Transfer Methods */}
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-muted-foreground">Send Money To</h2>
              <div className="grid gap-4">
                {transferMethods.map((method) => (
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
          </>
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

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Note (Optional)</label>
                  <Input
                    placeholder="Add a note"
                    className="bg-muted border-0 rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full h-12 rounded-xl"
              disabled={!amount || status === 'processing'}
              onClick={handleTransfer}
            >
              {status === 'processing' ? 'Processing...' : 'Send Money'}
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}