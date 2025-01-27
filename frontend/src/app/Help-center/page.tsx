"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Phone, Mail, MessageCircle, ChevronRight } from 'lucide-react';

const faqCategories = [
  {
    title: 'Getting Started',
    faqs: [
      { q: 'How do I create an account?', a: 'To create an account, click on the "Sign Up" button and follow the registration process...' },
      { q: 'What documents do I need for verification?', a: 'You\'ll need a valid government ID and proof of address...' },
    ]
  },
  {
    title: 'Payments & Transfers',
    faqs: [
      { q: 'How do I send money?', a: 'To send money, go to the "Send Money" section from your dashboard...' },
      { q: 'What are the transfer limits?', a: 'Daily transfer limits depend on your account verification level...' },
    ]
  },
  {
    title: 'Account Security',
    faqs: [
      { q: 'How do I enable 2FA?', a: 'You can enable two-factor authentication in your security settings...' },
      { q: 'What should I do if I forget my password?', a: 'Click on "Forgot Password" on the login page...' },
    ]
  }
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-green-800">Help Center</h1>
        <p className="text-green-600">How can we help you today?</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
        <Input
          type="search"
          placeholder="Search for help..."
          className="pl-10 border-green-100"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-100">
          <CardContent className="p-6 text-center">
            <Phone className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium text-green-800">Call Us</h3>
            <p className="text-sm text-green-600 mt-1">+211 123 456 789</p>
            <p className="text-xs text-green-600 mt-1">24/7 Support</p>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardContent className="p-6 text-center">
            <Mail className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium text-green-800">Email Support</h3>
            <p className="text-sm text-green-600 mt-1">support@tanina.com</p>
            <p className="text-xs text-green-600 mt-1">Response within 24h</p>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardContent className="p-6 text-center">
            <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium text-green-800">Live Chat</h3>
            <Button 
              variant="outline" 
              className="mt-2 border-green-600 text-green-600"
            >
              Start Chat
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Categories */}
      {faqCategories.map((category) => (
        <Card key={category.title} className="border-green-100">
          <CardHeader>
            <CardTitle className="text-green-800">{category.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {category.faqs.map((faq, index) => (
              <details 
                key={index}
                className="group"
              >
                <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <span className="font-medium text-green-800">{faq.q}</span>
                  <ChevronRight className="w-5 h-5 text-green-600 transform group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-2 p-4 text-green-600">
                  {faq.a}
                </div>
              </details>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}