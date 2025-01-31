"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Download, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"

const MerchantTill = () => {
  const [tillNumber, setTillNumber] = useState("")
  const [amount, setAmount] = useState("")
  const [transactionDetails, setTransactionDetails] = useState("")
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null)
  const router = useRouter()

  const generateInvoice = () => {
    // Create invoice data
    const invoiceData = {
      tillNumber,
      amount,
      transactionDetails,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    }

    // Generate invoice HTML
    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${tillNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .invoice { max-width: 600px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; }
            .details { margin-bottom: 20px; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="invoice">
            <div class="header">
              <h1>Invoice</h1>
              <p>Till Number: ${tillNumber}</p>
            </div>
            <div class="details">
              <div class="detail-row">
                <span>Date:</span>
                <span>${invoiceData.date}</span>
              </div>
              <div class="detail-row">
                <span>Time:</span>
                <span>${invoiceData.time}</span>
              </div>
              <div class="detail-row">
                <span>Amount:</span>
                <span>$${amount}</span>
              </div>
              <div class="detail-row">
                <span>Details:</span>
                <span>${transactionDetails}</span>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    // Create blob and download URL
    const blob = new Blob([invoiceHtml], { type: "text/html" })
    const url = window.URL.createObjectURL(blob)
    setInvoiceUrl(url)
  }

  const downloadInvoice = () => {
    if (!invoiceUrl) return

    const link = document.createElement("a")
    link.href = invoiceUrl
    link.download = `invoice-${tillNumber}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
            <h1 className="text-lg font-semibold text-foreground">Merchant Till</h1>
          </div>
        </div>

        {/* Till Number */}
        <Card className="shadow-sm border-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-foreground">Till Number</CardTitle>
          </CardHeader>
          <CardContent>
            <Input 
              value={tillNumber} 
              onChange={(e) => setTillNumber(e.target.value)}
              className="text-xl font-bold h-12"
              placeholder="Enter till number"
            />
          </CardContent>
        </Card>

        {/* Amount */}
        <Card className="shadow-sm border-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-foreground">Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-xl font-bold h-12 pl-8"
                placeholder="0.00"
              />
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Transaction Details */}
        <Card className="shadow-sm border-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-foreground">Transaction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={transactionDetails}
              onChange={(e) => setTransactionDetails(e.target.value)}
              className="h-12"
              placeholder="Enter transaction details"
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-4">
          <Button
            onClick={generateInvoice}
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Make Payment
          </Button>
          {invoiceUrl && (
            <Button
              onClick={downloadInvoice}
              variant="outline"
              className="w-full h-12 rounded-xl border-0 bg-muted hover:bg-muted/80 text-foreground"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Invoice
            </Button>
          )}
        </div>
      </div>
    </ScrollArea>
  )
}

export default MerchantTill