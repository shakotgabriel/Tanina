"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowUpRight, Handshake, Receipt, MoreHorizontal, Search, Bell, Plus, ArrowRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recentBills = [
  {
    icon: "/logos/kfc.png",
    name: "KFC Cafe",
    date: "10 Dec, 2023",
    time: "09:30",
    amount: 61.43,
    progress: 75
  },
  {
    icon: "/logos/mcdonalds.png",
    name: "McD Sudirman",
    date: "10 Dec, 2023",
    time: "09:30",
    amount: 61.43,
    progress: 50
  },
]

export default function MobileDashboardPage() {
  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6 bg-background min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 rounded-2xl overflow-hidden">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>TA</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">Good Morning,</p>
              <h1 className="text-lg font-semibold text-foreground">Tanina 👋</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-0 bg-muted hover:bg-muted/80">
              <Search className="h-5 w-5 text-foreground" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-0 bg-muted hover:bg-muted/80">
              <Bell className="h-5 w-5 text-foreground" />
            </Button>
          </div>
        </div>

        {/* Balance Card */}
        <Card className="bg-primary text-primary-foreground rounded-3xl border-none shadow-sm">
          <CardContent className="pt-6 pb-6">
            <h2 className="text-sm text-primary-foreground/80 mb-2">Your Balance</h2>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">2,588.00 USD</p>
              <Button className="bg-background text-foreground hover:bg-accent rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                Top Up
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="flex gap-3 overflow-auto pb-2 -mx-6 px-6">
          <Card className="shadow-sm border-0 rounded-2xl flex-shrink-0 w-[180px]">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-foreground mb-1">Monthly Bills</h3>
              <p className="text-2xl font-bold text-foreground">$135.00</p>
              <p className="text-sm text-muted-foreground mt-1">Due: Feb 1</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 rounded-2xl flex-shrink-0 w-[180px]">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-foreground mb-1">Savings Goal</h3>
              <p className="text-2xl font-bold text-foreground">$3,890</p>
              <p className="text-sm text-muted-foreground mt-1">Target: $5,000</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3">
          <Button
            variant="ghost"
            className="h-24 bg-muted hover:bg-muted/80 rounded-2xl flex flex-col items-center justify-center gap-2 p-0 border-0"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ArrowUpRight className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm text-foreground">Transfer</span>
          </Button>

          <Button
            variant="ghost"
            className="h-24 bg-muted hover:bg-muted/80 rounded-2xl flex flex-col items-center justify-center gap-2 p-0 border-0"
          >
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Handshake className="h-5 w-5 text-secondary" />
            </div>
            <span className="text-sm text-foreground">Request</span>
          </Button>

          <Button
            variant="ghost"
            className="h-24 bg-muted hover:bg-muted/80 rounded-2xl flex flex-col items-center justify-center gap-2 p-0 border-0"
          >
            <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
              <Receipt className="h-5 w-5 text-chart-3" />
            </div>
            <span className="text-sm text-foreground">Split Bill</span>
          </Button>

          <Button
            variant="ghost"
            className="h-24 bg-muted hover:bg-muted/80 rounded-2xl flex flex-col items-center justify-center gap-2 p-0 border-0"
          >
            <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
              <MoreHorizontal className="h-5 w-5 text-chart-4" />
            </div>
            <span className="text-sm text-foreground">Payments</span>
          </Button>
        </div>

        {/* Recent Bills */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent Bills</h2>
            <Button variant="ghost" size="sm" className="rounded-full hover:bg-muted/80 shadow-sm border border-border/5">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {recentBills.map((bill) => (
              <Card key={bill.name} className="shadow-sm border-0 rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center overflow-hidden">
                        <img src={bill.icon} alt={bill.name} className="w-6 h-6 rounded-lg" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{bill.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {bill.date} | {bill.time}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-medium text-foreground">${bill.amount}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Progress
                          value={bill.progress}
                          className="w-20 h-2 rounded-full"
                        />
                        <span className="text-sm text-primary">{bill.progress}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}