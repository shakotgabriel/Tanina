"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProtectedLayout } from '@/components/layouts/protected-layout';
import { useWallet, useWithdraw } from '@/hooks/use-wallet';
import { formatCurrency } from '@/lib/utils';
import { z } from 'zod';

const withdrawSchema = z.object({
  amount: z.number()
    .positive('Amount must be positive'),
  bankAccount: z.string()
    .min(10, 'Bank account number must be at least 10 characters')
    .max(20, 'Bank account number cannot exceed 20 characters'),
});

export default function WithdrawPage() {
  const router = useRouter();
  const { data: wallet } = useWallet({ enabled: true });
  const withdraw = useWithdraw();
  
  const [formData, setFormData] = useState({
    amount: '',
    bankAccount: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    try {
      const amount = Number(formData.amount);
      withdrawSchema.parse({
        amount,
        bankAccount: formData.bankAccount,
      });
      
      if (amount > (wallet?.balance || 0)) {
        throw new Error('Insufficient balance');
      }
      
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
      } else if (error instanceof Error) {
        setErrors({ amount: error.message });
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
      await withdraw.mutateAsync({
        amount: Number(formData.amount),
        bankAccount: formData.bankAccount,
      });
      router.push('/user/dashboard');
    } catch (error) {
      setErrors({
        form: 'Failed to process withdrawal. Please try again.',
      });
    }
  };

  return (
    <ProtectedLayout>
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-green-800">Withdraw Money</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="text-sm text-gray-600">Available Balance</div>
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
                <label className="text-sm font-medium text-green-800">Bank Account Number</label>
                <Input
                  type="text"
                  required
                  value={formData.bankAccount}
                  onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                  className={`w-full ${errors.bankAccount ? 'border-red-500' : ''}`}
                />
                {errors.bankAccount && (
                  <p className="text-sm text-red-500">{errors.bankAccount}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={withdraw.isPending}
              >
                {withdraw.isPending ? 'Processing...' : 'Withdraw Money'}
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
