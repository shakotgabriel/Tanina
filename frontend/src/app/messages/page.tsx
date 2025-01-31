"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Bell, ShieldCheck, CreditCard, Wallet } from "lucide-react"

// Mock data for messages
const messages = [
  {
    id: 1,
    type: 'transaction',
    title: 'Payment Successful',
    description: 'Your payment of $50.00 to JEDCO was successful',
    date: '2 hours ago',
    icon: <CreditCard className="h-5 w-5" />,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    read: false
  },
  {
    id: 2,
    type: 'security',
    title: 'New Login Detected',
    description: 'A new login was detected from South Sudan',
    date: '5 hours ago',
    icon: <ShieldCheck className="h-5 w-5" />,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    read: false
  },
  {
    id: 3,
    type: 'transaction',
    title: 'Money Received',
    description: 'You received $100.00 from John Doe',
    date: 'Yesterday',
    icon: <Wallet className="h-5 w-5" />,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    read: true
  },
]

type MessageType = 'all' | 'transaction' | 'security'

const Messages = () => {
  const [activeTab, setActiveTab] = useState<MessageType>('all')
  const [readMessages, setReadMessages] = useState<Set<number>>(new Set())

  const handleBack = () => {
    window.history.back()
  }

  const filteredMessages = messages.filter(message => 
    activeTab === 'all' || message.type === activeTab
  )

  const handleMessageClick = (messageId: number) => {
    setReadMessages(prev => {
      const newSet = new Set(prev)
      newSet.add(messageId)
      return newSet
    })
  }

  const isMessageRead = (messageId: number) => {
    return readMessages.has(messageId) || messages.find(m => m.id === messageId)?.read
  }

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'transaction', label: 'Transactions' },
    { id: 'security', label: 'Security' },
  ]

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-10 h-10 bg-green-50 hover:bg-green-100"
          onClick={handleBack}
        >
          <ChevronLeft className="h-5 w-5 text-green-600" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-green-800">Message Center</h1>
          <p className="text-green-600">View your notifications and updates</p>
        </div>
      </div>

      {/* Message Filters */}
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            className={`rounded-lg px-4 py-2 ${
              activeTab === tab.id
                ? 'bg-green-100 text-green-800'
                : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}
            onClick={() => setActiveTab(tab.id as MessageType)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Messages List */}
      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="text-green-800">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-green-300 mx-auto mb-3" />
              <p className="text-green-600">No notifications to show</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <Button
                key={message.id}
                variant="ghost"
                className={`w-full flex items-start justify-between p-4 rounded-lg transition-colors h-auto ${
                  isMessageRead(message.id)
                    ? 'bg-green-50/50 hover:bg-green-50'
                    : 'bg-green-50 hover:bg-green-100'
                }`}
                onClick={() => handleMessageClick(message.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-lg ${message.bgColor} flex items-center justify-center mt-1`}>
                    <div className={message.color}>{message.icon}</div>
                  </div>
                  <div className="text-left">
                    <h3 className={`font-medium ${
                      isMessageRead(message.id) ? 'text-green-700' : 'text-green-800'
                    }`}>
                      {message.title}
                    </h3>
                    <p className={`text-sm ${
                      isMessageRead(message.id) ? 'text-green-500' : 'text-green-600'
                    }`}>
                      {message.description}
                    </p>
                    <p className="text-sm text-green-400 mt-1">{message.date}</p>
                  </div>
                </div>
                {!isMessageRead(message.id) && (
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                )}
              </Button>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Messages