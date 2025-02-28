"use client"

import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Building2, Upload, CheckCircle2, XCircle } from "lucide-react"
import { useRouter } from 'next/navigation'

export default function BankTransferProcessPage() {
  const router = useRouter()
  const [reference, setReference] = useState('')
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'failed'>('idle')
  const [receipt, setReceipt] = useState<File | null>(null)

  const handleVerify = async () => {
    setStatus('verifying')
    // Simulate verification process
    setTimeout(() => {
      setStatus('success')
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
            onClick={() => router.back()}
            disabled={status === 'verifying'}
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Verify Bank Transfer</h1>
        </div>

        {/* Transaction Card */}
        <Card className="shadow-sm border-0 rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-lg font-semibold text-foreground">$100.00</p>
              <p className="text-sm text-muted-foreground">Bank Transfer</p>
            </div>
          </CardContent>
        </Card>

        {status === 'idle' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Transfer Reference</label>
                <Input
                  placeholder="Enter bank reference number"
                  className="bg-muted border-0 rounded-xl"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                />
              </div>

              {/* Receipt Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Upload Receipt (Optional)</label>
                <div 
                  className="p-4 bg-muted rounded-xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center gap-2 cursor-pointer"
                  onClick={() => document.getElementById('receipt-upload')?.click()}
                >
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload receipt</p>
                  <input
                    id="receipt-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setReceipt(e.target.files?.[0] || null)}
                  />
                </div>
                {receipt && (
                  <p className="text-sm text-green-500">✓ {receipt.name}</p>
                )}
              </div>
            </div>

            <Button 
              className="w-full h-12 rounded-xl"
              disabled={!reference}
              onClick={handleVerify}
            >
              Verify Transfer
            </Button>
          </div>
        )}

        {status === 'verifying' && (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <h2 className="text-xl font-semibold text-foreground">Verifying Transfer</h2>
              <p className="text-sm text-muted-foreground text-center">
                Please wait while we verify your transfer...
              </p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold text-green-500">Transfer Verified!</h2>
              <p className="text-sm text-muted-foreground text-center">
                Your wallet has been credited with $100.00
              </p>
            </div>

            <div className="grid gap-4">
              <Button 
                className="w-full h-12 rounded-xl"
                onClick={() => router.push('/user/dashboard')}
              >
                Back to Home
              </Button>
              <Button 
                variant="outline"
                className="w-full h-12 rounded-xl"
                onClick={() => router.push('/user/wallet/deposit')}
              >
                Top Up Again
              </Button>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-red-500">Verification Failed</h2>
              <p className="text-sm text-muted-foreground text-center">
                We couldn't verify your transfer. Please check the reference number and try again.
              </p>
            </div>

            <div className="grid gap-4">
              <Button 
                className="w-full h-12 rounded-xl"
                onClick={() => setStatus('idle')}
              >
                Try Again
              </Button>
              <Button 
                variant="outline"
                className="w-full h-12 rounded-xl"
                onClick={() => router.push('/user/dashboard')}
              >
                Back to Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}