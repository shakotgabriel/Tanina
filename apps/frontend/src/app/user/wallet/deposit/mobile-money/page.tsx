"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Phone, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { useRouter } from 'next/navigation'

const steps = [
  { id: 1, text: 'Initiating mobile money request' },
  { id: 2, text: 'Check your phone for prompt' },
  { id: 3, text: 'Enter PIN to confirm' },
  { id: 4, text: 'Processing payment' },
  { id: 5, text: 'Completing transaction' }
];

export default function MobileMoneyProcessPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing')

  // Simulate processing steps
  useEffect(() => {
    const timer = setInterval(() => {
      if (currentStep < steps.length) {
        setCurrentStep(prev => prev + 1)
      } else {
        clearInterval(timer)
        setStatus('success')
        // Simulate a failed state occasionally
        // if (Math.random() > 0.8) setStatus('failed')
      }
    }, 2000)

    return () => clearInterval(timer)
  }, [currentStep])

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
            disabled={status === 'processing'}
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Mobile Money Top Up</h1>
        </div>

        {/* Transaction Card */}
        <Card className="shadow-sm border-0 rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
                <Phone className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-lg font-semibold text-foreground">$100.00</p>
              <p className="text-sm text-muted-foreground">via MTN Mobile Money</p>
            </div>
          </CardContent>
        </Card>

        {/* Processing Steps */}
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex items-center gap-4"
            >
              <div className="flex-shrink-0">
                {currentStep > step.id ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : currentStep === step.id ? (
                  <div className="animate-spin">
                    <Loader2 className="h-6 w-6 text-primary" />
                  </div>
                ) : (
                  <div className="h-6 w-6 rounded-full border-2 border-muted" />
                )}
              </div>
              <p className={`text-sm ${currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step.text}
              </p>
            </div>
          ))}
        </div>

        {/* Status Messages */}
        {status === 'success' && (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold text-green-500">Top Up Successful!</h2>
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
              <h2 className="text-xl font-semibold text-red-500">Top Up Failed</h2>
              <p className="text-sm text-muted-foreground text-center">
                The transaction could not be completed. Please try again.
              </p>
            </div>

            <div className="grid gap-4">
              <Button 
                className="w-full h-12 rounded-xl"
                onClick={() => router.push('/user/wallet/deposit')}
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