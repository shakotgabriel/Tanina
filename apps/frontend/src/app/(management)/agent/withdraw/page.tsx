"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@radix-ui/react-select"
import { useRouter } from "next/navigation"
import { ArrowUpRight } from "lucide-react"

export default function WithdrawPage() {
  const router = useRouter()
  const [userId, setUserId] = useState("")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleWithdraw = async () => {
    setLoading(true)
    setMessage("")
    try {
      const response = await fetch("/api/transactions/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: 1, userId, amount: parseFloat(amount), currency }),
      })
      if (response.ok) {
        setMessage("Withdrawal successful!")
      } else {
        setMessage("Withdrawal failed.")
      }
    } catch (error) {
      setMessage("An error occurred.")
    }
    setLoading(false)
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <h1 className="text-lg font-semibold text-foreground">Withdraw Money</h1>
      <Card className="rounded-3xl shadow-sm border-none">
        <CardContent className="p-6 space-y-4">
          <Input
            type="text"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="KES">KES</SelectItem>
              <SelectItem value="SSP">SSP</SelectItem>
              <SelectItem value="UGX">UGX</SelectItem>
              <SelectItem value="RWF">RWF</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-14 text-lg font-semibold"
            onClick={handleWithdraw}
            disabled={loading}
          >
            <ArrowUpRight className="h-6 w-6 mr-2" />
            {loading ? "Processing..." : "Withdraw"}
          </Button>
          {message && <p className="text-center text-muted-foreground">{message}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
