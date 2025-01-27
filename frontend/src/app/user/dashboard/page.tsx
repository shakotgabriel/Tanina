"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const mockData = [
  { month: "Jan", balance: 4000 },
  { month: "Feb", balance: 3000 },
  { month: "Mar", balance: 5000 },
  { month: "Apr", balance: 4500 },
  { month: "May", balance: 6000 },
]

const utilityPayments = [
  {
    icon: "⚡",
    name: "Electricity",
    provider: "South Sudan Electric",
    lastPayment: 45.0,
    dueDate: "2024-02-01",
  },
  {
    icon: "💧",
    name: "Water",
    provider: "Urban Water Corp",
    lastPayment: 30.0,
    dueDate: "2024-02-05",
  },
  {
    icon: "📱",
    name: "Internet",
    provider: "MTN Broadband",
    lastPayment: 60.0,
    dueDate: "2024-02-03",
  },
]

export default function MobileDashboardPage() {
  return (
    <ScrollArea className="h-screen">
      <div className="p-4 space-y-4 bg-white min-h-screen">
        {/* Main Balance Card */}
        <Card className="border-green-100">
          <CardContent className="pt-6 pb-4">
            <h2 className="text-sm text-green-800 mb-1">Available Balance</h2>
            <p className="text-3xl font-bold text-green-600">$5,240.00</p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            className="h-16 text-sm bg-green-600 hover:bg-green-700 text-white flex flex-col items-center justify-center"
            onClick={() => (window.location.href = "/user/wallet/deposit")}
          >
            <span className="text-lg mb-1">💰</span>
            Deposit
          </Button>
          <Button
            className="h-16 text-sm border-green-600 text-green-600 hover:bg-green-50 flex flex-col items-center justify-center"
            variant="outline"
            onClick={() => (window.location.href = "/user/wallet/send")}
          >
            <span className="text-lg mb-1">➡️</span>
            Send
          </Button>
          <Button
            className="h-16 text-sm bg-green-600 hover:bg-green-700 text-white flex flex-col items-center justify-center"
            onClick={() => (window.location.href = "/user/wallet/withdraw")}
          >
            <span className="text-lg mb-1">📤</span>
            Withdraw
          </Button>
          <Button
            className="h-16 text-sm border-green-600 text-green-600 hover:bg-green-50 flex flex-col items-center justify-center"
            variant="outline"
            onClick={() => (window.location.href = "/user/payments")}
          >
            <span className="text-lg mb-1">📃</span>
            Bills
          </Button>
        </div>

        {/* Stats Overview */}
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-3 py-2">
            <Card className="border-green-100 flex-shrink-0 w-[160px]">
              <CardContent className="p-3">
                <h3 className="text-xs text-green-800">Monthly Bills</h3>
                <p className="text-lg font-bold text-green-600">$135.00</p>
                <p className="text-xs text-green-600">Due: Feb 1</p>
              </CardContent>
            </Card>

            <Card className="border-green-100 flex-shrink-0 w-[160px]">
              <CardContent className="p-3">
                <h3 className="text-xs text-green-800">Savings Goal</h3>
                <p className="text-lg font-bold text-green-600">$3,890</p>
                <p className="text-xs text-green-600">Target: $5,000</p>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Upcoming Bills */}
        <div>
          <h2 className="text-base font-semibold text-green-800 mb-2">Upcoming Bills</h2>
          <div className="space-y-2">
            {utilityPayments.map((bill) => (
              <Card key={bill.name} className="border-green-100">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{bill.icon}</span>
                      <div>
                        <h3 className="font-semibold text-sm text-green-800">{bill.name}</h3>
                        <p className="text-xs text-green-600">{bill.provider}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-green-600 text-green-600 text-xs h-7">
                      Pay
                    </Button>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-green-600">
                    <span>Due: {new Date(bill.dueDate).toLocaleDateString()}</span>
                    <span>${bill.lastPayment}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Balance Chart */}
        <Card className="border-green-100">
          <CardHeader className="p-3">
            <CardTitle className="text-green-800 text-base">Balance History</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="h-[150px] relative">
              <div className="flex items-end h-full space-x-1">
                {mockData.map((data) => (
                  <div key={data.month} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-green-500 rounded-t"
                      style={{ height: `${(data.balance / 6000) * 100}%` }}
                    />
                    <span className="text-xs mt-1 text-green-600">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div>
          <h2 className="text-base font-semibold text-green-800 mb-2">Recent Activity</h2>
          <div className="space-y-2">
            <Card className="border-green-100">
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm text-green-800">Electricity Bill</p>
                    <p className="text-xs text-green-600">South Sudan Electric</p>
                  </div>
                  <span className="font-medium text-sm text-red-600">-$45.00</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-100">
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm text-green-800">Internet Bill</p>
                    <p className="text-xs text-green-600">MTN Broadband</p>
                  </div>
                  <span className="font-medium text-sm text-red-600">-$60.00</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

