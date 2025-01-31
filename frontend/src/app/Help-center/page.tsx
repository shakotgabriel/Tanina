"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, Phone, Mail, MessageCircle, ChevronRight, Wallet, 
  SendHorizontal, Building, Shield, CreditCard, BellRing, 
  Globe, PiggyBank, Clock
} from 'lucide-react';

const mainCategories = [
  {
    title: 'Accounts & Getting Started',
    icon: <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />,
    faqs: [
      { q: 'How do I create a Tanina account?', a: 'Our automatic bank account creation system streamlines the onboarding process. Provide your ID documents and follow the verification steps.' },
      { q: 'What documents do I need?', a: 'Valid government ID and phone number.' },
      { q: 'How do I link my accounts?', a: 'Go to "Link Accounts" to connect with local banks and  mobile money.' }
    ]
  },
  {
    title: 'Money Transfers',
    icon: <SendHorizontal className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />,
    faqs: [
      { q: 'What transfers can I make?', a: 'P2P transfers between users, bank transfers, mobile money transfers, and international transactions.' },
      { q: 'What are the fees?', a: 'Competitive fees with volume-based discounts. Fees are displayed before each transaction.' },
      { q: 'How long do transfers take?', a: 'Instant between Tanina accounts. Bank transfers: instant. International: 1-2 business days.' }
    ]
  },
  {
    title: 'Bill Payments',
    icon: <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />,
    faqs: [
      { q: 'What bills can I pay?', a: 'Utilities (electricity, water, gas), internet, phone, school fees, and government services.' },
      { q: 'Can I schedule payments?', a: 'Yes, set up recurring payments and save payment templates for quick access.' }
    ]
  },
  {
    title: 'Business Services',
    icon: <Building className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />,
    faqs: [
      { q: 'What business features are available?', a: 'Bulk transactions, payroll management, Till Number system, and international payments.' },
      { q: 'How does the Till Number work?', a: 'Acts as a virtual cash register for efficient payment collection.' }
    ]
  },
  {
    title: 'Security',
    icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />,
    faqs: [
      { q: 'How is my money protected?', a: 'End-to-end encryption, biometric authentication, and strict banking standards compliance.' },
      { q: 'What security features are available?', a: 'Fingerprint/facial recognition, 2FA, SMS verification, and hardware token support.' },
      { q: 'How do I report issues?', a: 'Contact our 24/7 security team via app or emergency hotline.' }
    ]
  },
  {
    title: 'International',
    icon: <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />,
    faqs: [
      { q: 'Which countries are supported?', a: 'Currently available across East Africa with ongoing expansion plans.' },
      { q: 'How do exchange rates work?', a: 'Real-time competitive rates displayed before confirmation.' }
    ]
  }
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(mainCategories);

  const handleSearch = (e: { target: { value: string; }; }) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query) {
      setFilteredCategories(mainCategories);
      return;
    }

    const filtered = mainCategories.map(category => ({
      ...category,
      faqs: category.faqs.filter(faq => 
        faq.q.toLowerCase().includes(query) || 
        faq.a.toLowerCase().includes(query)
      )
    })).filter(category => category.faqs.length > 0);

    setFilteredCategories(filtered);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 bg-white z-10 p-4 border-b border-green-100">
        <div className="flex flex-col space-y-4 max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-green-800">Tanina Support</h1>
            <p className="text-sm sm:text-base text-green-600">Fast, Secure, Reliable</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 w-4 h-4 sm:w-5 sm:h-5" />
            <Input
              type="search"
              placeholder="Search help topics..."
              className="pl-10 border-green-100 text-sm sm:text-base"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Card className="border-green-100">
              <CardContent className="p-4 sm:p-6 text-center">
                <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-green-800 text-sm sm:text-base">24/7 Support</h3>
                <p className="text-xs sm:text-sm text-green-600">+211 123 456 789</p>
              </CardContent>
            </Card>

            <Card className="border-green-100">
              <CardContent className="p-4 sm:p-6 text-center">
                <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-green-800 text-sm sm:text-base">Email</h3>
                <p className="text-xs sm:text-sm text-green-600">support@tanina.com</p>
              </CardContent>
            </Card>

            <Card className="border-green-100 sm:col-span-2 lg:col-span-1">
              <CardContent className="p-4 sm:p-6 text-center">
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-green-800 text-sm sm:text-base">Chat</h3>
                <Button 
                  variant="outline" 
                  className="mt-2 border-green-600 text-green-600 hover:bg-green-50 text-xs sm:text-sm"
                >
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          {filteredCategories.map((category) => (
            <Card key={category.title} className="border-green-100">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-green-800 flex items-center gap-2 text-base sm:text-lg">
                  {category.icon}
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
                {category.faqs.map((faq, index) => (
                  <details 
                    key={index}
                    className="group"
                  >
                    <summary className="flex justify-between items-start cursor-pointer list-none p-3 sm:p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-sm sm:text-base">
                      <span className="font-medium text-green-800 pr-4 flex-1">{faq.q}</span>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 transform group-open:rotate-90 transition-transform flex-shrink-0 mt-1" />
                    </summary>
                    <div className="mt-2 p-3 sm:p-4 text-green-600 text-sm sm:text-base">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}