import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WithdrawFormData {
  amount: string;
  method: 'mobile_money' | 'bank_account';
  accountNumber: string;
}

export default function WithdrawForm() {
  const [formData, setFormData] = useState<WithdrawFormData>({
    amount: '',
    method: 'mobile_money',
    accountNumber: ''
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdraw Funds</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="text-sm font-medium">Withdrawal Method</label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="mobile_money">Mobile Money</option>
              <option value="bank_account">Bank Account</option>
            </select>
          </div>

          {formData.method === 'mobile_money' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                name="accountNumber"
                placeholder="Enter phone number"
                value={formData.accountNumber}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {formData.method === 'bank_account' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Number</label>
              <Input
                name="accountNumber"
                placeholder="Enter account number"
                value={formData.accountNumber}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={status === 'processing'}
          >
            {status === 'processing' ? 'Processing...' : 'Withdraw'}
          </Button>
        </form>

        {status === 'success' && (
          <Alert className="mt-4 bg-green-50">
            <AlertDescription>
              Withdrawal request submitted successfully!
            </AlertDescription>
          </Alert>
        )}

        {status === 'error' && (
          <Alert className="mt-4 bg-red-50">
            <AlertDescription>
              Failed to process withdrawal. Please try again.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}