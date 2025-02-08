"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProtectedLayout } from '@/components/layouts/protected-layout';
import { useWallet, useDeposit } from '@/hooks/use-wallet';
import { formatCurrency } from '@/lib/utils';
import { z } from 'zod';

const depositSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
});

const PAYMENT_METHODS = [
  { id: 'card', name: 'Credit/Debit Card' },
  { id: 'bank', name: 'Bank Transfer' },
  { id: 'mpesa', name: 'M-Pesa' },
];

export default function DepositPage() {
  const router = useRouter();
  const { data: wallet } = useWallet({ enabled: true });
  const deposit = useDeposit();
  
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: PAYMENT_METHODS[0].id,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    try {
      depositSchema.parse({
        ...formData,
        amount: Number(formData.amount),
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await deposit.mutateAsync({
        amount: Number(formData.amount),
        paymentMethod: formData.paymentMethod,
      });
      router.push('/user/dashboard');
    } catch (error) {
      setErrors({
        form: 'Failed to process deposit. Please try again.',
      });
    }
  };

  return (
    <ProtectedLayout>
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-green-800">Add Money</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="text-sm text-gray-600">Current Balance</div>
              <div className="text-2xl font-bold text-green-700">
                {formatCurrency(wallet?.balance || 0, wallet?.currency || 'USD')}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-green-800">Amount</label>
                <Input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className={`w-full ${errors.amount ? 'border-red-500' : ''}`}
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-green-800">Payment Method</label>
                <div className="grid grid-cols-1 gap-2">
                  {PAYMENT_METHODS.map((method) => (
                    <Button
                      key={method.id}
                      type="button"
                      variant={formData.paymentMethod === method.id ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                    >
                      {method.name}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={deposit.isPending}
              >
                {deposit.isPending ? 'Processing...' : 'Add Money'}
              </Button>

              {errors.form && (
                <Alert className="bg-red-50 text-red-700">
                  <AlertDescription>{errors.form}</AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}
