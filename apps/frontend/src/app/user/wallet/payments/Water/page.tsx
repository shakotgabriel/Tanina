"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Zap, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"

const currencyOptions = [
  { id: 'usd', label: 'USD', symbol: '$' },
  { id: 'ssp', label: 'SSP', symbol: 'SSP' }
]

const Water = () => {
  const [meterNumber, setMeterNumber] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [amount, setAmount] = useState("")
  const [selectedCurrency, setSelectedCurrency] = useState(currencyOptions[0])
  const router = useRouter()

  const handlePayment = () => {
    // Handle payment processing
    console.log({
      meterNumber,
      phoneNumber,
      amount,
      currency: selectedCurrency.id
    })
  }

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6 bg-background min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 border-0 bg-muted hover:bg-muted/80"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </Button>
            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-foreground">Pay Water Bill</h1>
              <p className="text-sm text-muted-foreground">Water Cooperation</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
            <Zap className="h-5 w-5 text-yellow-500" />
          </div>
        </div>

        {/* Meter Number */}
        <Card className="shadow-sm border-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-foreground">Meter Number</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={meterNumber}
              onChange={(e) => setMeterNumber(e.target.value)}
              className="text-xl font-bold h-12"
              placeholder="Enter meter number"
            />
          </CardContent>
        </Card>

        {/* Phone Number */}
        <Card className="shadow-sm border-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-foreground">Phone Number</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="text-xl font-bold h-12"
              placeholder="Enter phone number"
              type="tel"
            />
          </CardContent>
        </Card>

        {/* Amount and Currency */}
        <Card className="shadow-sm border-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-foreground">Amount</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-xl font-bold h-12 pl-8"
                placeholder="0.00"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {currencyOptions.map((currency) => (
                <Button
                  key={currency.id}
                  type="button"
                  variant={selectedCurrency.id === currency.id ? "default" : "outline"}
                  className={`h-12 rounded-xl ${
                    selectedCurrency.id === currency.id 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border-0 bg-muted hover:bg-muted/80"
                  }`}
                  onClick={() => setSelectedCurrency(currency)}
                >
                  {currency.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Pay {selectedCurrency.symbol}{amount || "0.00"}
        </Button>
      </div>
    </ScrollArea>
  )
}

export default Water