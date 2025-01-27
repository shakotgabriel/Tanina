"use client"

import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Wallet, Phone, Building2, CreditCard } from "lucide-react"
import { useRouter } from 'next/navigation'

const depositMethods = [
  {
    id: 'mobile_money',
    name: 'Mobile Money',
    icon: <Phone className="h-5 w-5" />,
    description: 'MTN MOMO, MGURUSH ',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10'
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: <Building2 className="h-5 w-5" />,
    description: 'Direct bank deposit',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    id: 'card',
    name: 'Card Payment',
    icon: <CreditCard className="h-5 w-5" />,
    description: 'Visa, Mastercard',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  {
    id: 'agent',
    name: 'Tanina Agent',
    icon: <Wallet className="h-5 w-5" />,
    description: 'Visit nearby agent',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  }
];

export default function DepositPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [method, setMethod] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState<'idle' | 'processing'>('idle')

  const handleDeposit = async () => {
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
          <h1 className="text-xl font-semibold text-foreground">Top Up Money</h1>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            {/* Current Balance */}
            <Card className="shadow-sm border-0 rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Balance</p>
                    <p className="text-2xl font-bold text-foreground">$2,588.00</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deposit Methods */}
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-muted-foreground">Select Payment Method</h2>
              <div className="grid gap-4">
                {depositMethods.map((method) => (
                  <Button
                    key={method.id}
                    variant="ghost"
                    className="w-full bg-muted hover:bg-muted/80 rounded-2xl flex items-center gap-4 p-4 h-auto"
                    onClick={() => {
                      setMethod(method.id)
                      setStep(2)
                    }}
                  >
                    <div className={`w-12 h-12 rounded-2xl ${method.bgColor} flex items-center justify-center`}>
                      <div className={method.color}>{method.icon}</div>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">{method.name}</p>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  </Button>
                ))}
              </div>
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
                </div>

                {method === 'mobile_money' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Mobile Number</label>
                    <Input
                      placeholder="Enter mobile number"
                      className="bg-muted border-0 rounded-xl"
                    />
                    <div className="flex gap-2 mt-4">
                      <Button className="flex-1 h-12" variant="outline">MTN MOMO Money</Button>
                      <Button className="flex-1 h-12" variant="outline">MGURUSH Money</Button>
                    </div>
                  </div>
                )}

                {method === 'bank' && (
                  <div className="bg-muted p-4 rounded-xl space-y-2">
                    <h3 className="font-medium text-foreground">Bank Details</h3>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Bank: South Sudan Commercial Bank</p>
                      <p className="text-sm text-muted-foreground">Account Name: Tanina Wallet</p>
                      <p className="text-sm text-muted-foreground">Account Number: 1234567890</p>
                      <p className="text-sm text-muted-foreground">Reference: Your Wallet ID</p>
                    </div>
                  </div>
                )}

                {method === 'card' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Card Number</label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        className="bg-muted border-0 rounded-xl"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Expiry Date</label>
                        <Input
                          placeholder="MM/YY"
                          className="bg-muted border-0 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">CVV</label>
                        <Input
                          placeholder="123"
                          className="bg-muted border-0 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {method === 'agent' && (
                  <div className="bg-muted p-4 rounded-xl space-y-2">
                    <h3 className="font-medium text-foreground">Nearby Agents</h3>
                    <p className="text-sm text-muted-foreground">
                      Visit any of our agents with your wallet ID to deposit money.
                      Show them the QR code below.
                    </p>
                    <div className="mt-4 aspect-square bg-white rounded-xl flex items-center justify-center">
                      <p className="text-muted-foreground">QR Code Placeholder</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {(method === 'mobile_money' || method === 'card') && (
              <Button
                className="w-full h-12 rounded-xl"
                disabled={!amount || status === 'processing'}
                onClick={handleDeposit}
              >
                {status === 'processing' ? 'Processing...' : 'Top Up'}
              </Button>
            )}

            {method === 'bank' && (
              <Button
                className="w-full h-12 rounded-xl"
                onClick={() => router.push('/success')}
              >
                I have made the transfer
              </Button>
            )}
          </div>
        )}
      </div>
    </ScrollArea>
  )
}