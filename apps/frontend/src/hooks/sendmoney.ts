import { useState, ChangeEvent } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface SendMoneyFormData {
  recipientId: string;
  amount: string;
  method: 'wallet' | 'mobile_money' | 'bank_account';
  description?: string;
}

const initialState: SendMoneyFormData = {
  recipientId: '',
  amount: '',
  method: 'wallet',
  description: '',
};

export const useSendMoney = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SendMoneyFormData>(initialState);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/transactions/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toAccountId: parseInt(formData.recipientId),
          amount: parseFloat(formData.amount),
          method: formData.method,
          description: formData.description || 'Money Transfer',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send money');
      }

      const data = await response.json();
      
      toast({
        title: "Success!",
        description: "Money sent successfully",
        variant: "default",
      });

      // Reset form
      setFormData(initialState);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send money",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.recipientId) return false;
    if (!formData.amount || parseFloat(formData.amount) <= 0) return false;
    if (!formData.method) return false;
    return true;
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    isLoading,
    validateForm,
  };
};