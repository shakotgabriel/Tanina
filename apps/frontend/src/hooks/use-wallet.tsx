import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authAxios } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export interface WalletData {
  id: string;
  balance: number;
  currency: string;
  lastUpdated: string;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

export const useWallet = (p0: { enabled: boolean; }) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      try {
        const { data } = await authAxios.get<WalletData>('/wallet');
        return data;
      } catch (error) {
        // If unauthorized, let the auth interceptor handle it
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          throw error;
        }
        return null;
      }
    },
    refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
    staleTime: 5000, // Consider data stale after 5 seconds
    retry: 1, // Only retry once
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });
};

export const useTransactions = (limit: number = 10, p0: { enabled: boolean; }) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['transactions', limit],
    queryFn: async () => {
      try {
        const { data } = await authAxios.get<Transaction[]>(`/wallet/transactions?limit=${limit}`);
        return data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          throw error;
        }
        return [];
      }
    },
    refetchInterval: 10000,
    staleTime: 5000,
    retry: 1,
    refetchOnWindowFocus: true,
  });
};

export const useTransfer = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: { recipientId: string; amount: number; description?: string }) => {
      try {
        const response = await authAxios.post('/wallet/transfer', data);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.push('/auth/login');
        }
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate both wallet and transactions queries
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useDeposit = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: { amount: number; paymentMethod: string }) => {
      try {
        const response = await authAxios.post('/wallet/deposit', data);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.push('/auth/login');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useWithdraw = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: { amount: number; bankAccount: string }) => {
      try {
        const response = await authAxios.post('/wallet/withdraw', data);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.push('/auth/login');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
