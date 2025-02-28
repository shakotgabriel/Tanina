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
      // API call here
      setStatus('success');
    } catch (error) {
      setStatus('error');
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
            <label className="text-sm font-medium">Send Method</label>
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
              placeholder="Enter description"
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
        </form>

        {status === 'success' && (
          <Alert className="mt-4 bg-green-50">
            <AlertDescription>
              Money sent successfully!
            </AlertDescription>
          </Alert>
        )}

        {status === 'error' && (
          <Alert className="mt-4 bg-red-50">
            <AlertDescription>
              Failed to send money. Please try again.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}