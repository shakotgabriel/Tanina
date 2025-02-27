"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProtectedLayout } from '@/components/layouts/protected-layout';
import { useWallet, useTransfer } from '@/hooks/use-wallet';
import { formatCurrency } from '@/lib/utils';
import { z } from 'zod';

const transferSchema = z.object({
  recipientId: z.string().min(1, 'Recipient ID is required'),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().optional(),
});

export default function TransferPage() {
  const router = useRouter();
  const { data: wallet } = useWallet({ enabled: true });
  const transfer = useTransfer();
  
  const [formData, setFormData] = useState({
    recipientId: '',
    amount: '',
    description: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    try {
      transferSchema.parse({
        ...formData,
        amount: Number(formData.amount),
      });
      
      if (Number(formData.amount) > (wallet?.balance || 0)) {
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
      await transfer.mutateAsync({
        recipientId: formData.recipientId,
        amount: Number(formData.amount),
        description: formData.description || undefined,
      });
      router.push('/user/dashboard');
    } catch (error) {
      setErrors({
        form: 'Failed to transfer money. Please try again.',
      });
    }
  };

  return (
    <ProtectedLayout>
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-green-800">Transfer Money</CardTitle>
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
                <label className="text-sm font-medium text-green-800">Recipient ID</label>
                <Input
                  type="text"
                  required
                  value={formData.recipientId}
                  onChange={(e) => setFormData({ ...formData, recipientId: e.target.value })}
                  className={`w-full ${errors.recipientId ? 'border-red-500' : ''}`}
                />
                {errors.recipientId && (
                  <p className="text-sm text-red-500">{errors.recipientId}</p>
                )}
              </div>

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
                <label className="text-sm font-medium text-green-800">Description (Optional)</label>
                <Input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={transfer.isPending}
              >
                {transfer.isPending ? 'Processing...' : 'Transfer Money'}
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
