import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DepositFormData {
  amount: string;
  method: 'mobile_money' | 'bank_transfer' | 'card';
  reference?: string;
}

export default function DepositForm() {
  const [formData, setFormData] = useState<DepositFormData>({
    amount: '',
    method: 'mobile_money'
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
        <CardTitle>Deposit Funds</CardTitle>
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
            <label className="text-sm font-medium">Payment Method</label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="mobile_money">Mobile Money</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="card">Card Payment</option>
            </select>
          </div>

          {formData.method === 'mobile_money' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                name="reference"
                placeholder="Enter phone number"
                onChange={handleChange}
                required
              />
            </div>
          )}

          {formData.method === 'bank_transfer' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Reference Number</label>
              <Input
                name="reference"
                placeholder="Enter reference number"
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
            {status === 'processing' ? 'Processing...' : 'Deposit'}
          </Button>
        </form>

        {status === 'success' && (
          <Alert className="mt-4 bg-green-50">
            <AlertDescription>
              Deposit initiated successfully! Please follow payment instructions.
            </AlertDescription>
          </Alert>
        )}

        {status === 'error' && (
          <Alert className="mt-4 bg-red-50">
            <AlertDescription>
              Failed to process deposit. Please try again.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}