"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SendMoneyFormData {
  recipientId: string;
  amount: string;
  method: 'wallet' | 'mobile_money' | 'bank_account';
  description?: string;
}

export default function SendMoneyForm() {
  const [formData, setFormData] = useState<SendMoneyFormData>({
    recipientId: '',
    amount: '',
    method: 'wallet',
    description: ''
  });
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');
    
    try {
      const numericAmount = parseFloat(formData.amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error('Please enter a valid amount greater than 0');
      }

      const response = await fetch('transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAccountId: parseInt(localStorage.getItem('accountId') || '0', 10),
          toAccountId: parseInt(formData.recipientId, 10),
          amount: numericAmount,
          description: formData.description || 'Wallet Transfer'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Transfer failed');
      }

      setStatus('success');
      setFormData({
        recipientId: '',
        amount: '',
        method: 'wallet',
        description: ''
      });
      
      // Show success message
      alert('Transfer successful!');
    } catch (error) {
      setStatus('error');
      alert(error instanceof Error ? error.message : 'Transfer failed. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getRecipientLabel = () => {
    switch (formData.method) {
      case 'wallet': return 'Wallet ID';
      case 'mobile_money': return 'Phone Number';
      case 'bank_account': return 'Account Number';
      default: return 'Recipient ID';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Money</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Send to</label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="wallet">Tanina Wallet</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="bank_account">Bank Account</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{getRecipientLabel()}</label>
            <Input
              name="recipientId"
              placeholder={`Enter ${getRecipientLabel().toLowerCase()}`}
              value={formData.recipientId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input
              name="amount"
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description (Optional)</label>
            <Input
              name="description"
              placeholder="Enter transfer description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={status === 'processing'}
          >
            {status === 'processing' ? 'Processing...' : 'Send Money'}
          </Button>

          {status === 'error' && (
            <Alert variant="destructive">
              <AlertDescription>
                Transfer failed. Please check the details and try again.
              </AlertDescription>
            </Alert>
          )}

          {status === 'success' && (
            <Alert>
              <AlertDescription>
                Transfer completed successfully!
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}