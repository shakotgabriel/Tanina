"use client"

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Zap, Droplet, Phone, Wifi, Laptop, GraduationCap, Car, ShoppingBag } from "lucide-react"
import { useRouter } from 'next/navigation'

const billCategories = [
  {
    title: 'Utilities',
    items: [
      {
        id: 'electricity',
        name: 'Electricity',
        icon: <Zap className="h-5 w-5" />,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        route: '/user/wallet/payments/Electricity'
      },
      {
        id: 'water',
        name: 'Water',
        icon: <Droplet className="h-5 w-5" />,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        route: '/user/wallet/payments/Water'
      },
      {
        id: 'phone',
        name: 'Phone',
        icon: <Phone className="h-5 w-5" />,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        route: '/user/payments/phone'
      },
      {
        id: 'internet',
        name: 'Internet',
        icon: <Wifi className="h-5 w-5" />,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        route: '/user/payments/internet'
      }
    ]
  },
  {
    title: 'Services',
    items: [
      {
        id: 'education',
        name: 'Education',
        icon: <GraduationCap className="h-5 w-5" />,
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        route: '/user/wallet/payments/Education'
      },
      {
        id: 'transport',
        name: 'Transport',
        icon: <Car className="h-5 w-5" />,
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        route: '/user/wallet/payments/transport'
      },
      {
        id: 'shopping',
        name: 'Shopping',
        icon: <ShoppingBag className="h-5 w-5" />,
        color: 'text-pink-500',
        bgColor: 'bg-pink-500/10',
        route: '/user/wallet/payments/shopping'
      },
      {
        id: 'subscription',
        name: 'Subscriptions',
        icon: <Laptop className="h-5 w-5" />,
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-500/10',
        route: '/user/wallet/payments/subscription'
      }
    ]
  }
];

export default function PaymentsPage() {
  const router = useRouter()

  const handleSearch = (e: any) => {
    // Handle search functionality
  }

  const handleBillPayment = (route: string) => {
    router.push(route)
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
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Pay Bills</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10 bg-muted border-0 rounded-xl"
            placeholder="Search bills and services"
            onChange={handleSearch}
          />
        </div>

        {/* Bill Categories */}
        {billCategories.map((category) => (
          <div key={category.title} className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground">{category.title}</h2>
            <div className="grid grid-cols-2 gap-4">
              {category.items.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="h-24 bg-muted hover:bg-muted/80 rounded-2xl flex flex-col items-center justify-center gap-2 p-0 border-0"
                  onClick={() => handleBillPayment(item.route)}
                >
                  <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                    <div className={item.color}>{item.icon}</div>
                  </div>
                  <span className="text-sm text-foreground">{item.name}</span>
                </Button>
              ))}
            </div>
          </div>
        ))}

        {/* Recent Bills */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground">Recent Bills</h2>
          <Card className="shadow-sm border-0 rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Electricity Bill</p>
                    <p className="text-sm text-muted-foreground">Due in 5 days</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="h-8 px-3 rounded-lg"
                  onClick={() => handleBillPayment('/user/payments/Electricity')}
                >
                  Pay $45.00
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  )
}