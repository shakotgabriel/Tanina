import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'send' | 'receive';
  amount: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  recipient?: string;
  sender?: string;
  reference?: string;
}

export default function TransactionList() {
  // Mock data - replace with API call
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'deposit',
      amount: 1000,
      timestamp: '2024-01-24T10:30:00',
      status: 'completed',
      reference: 'DEP123'
    },
    {
      id: '2',
      type: 'send',
      amount: 500,
      timestamp: '2024-01-24T09:15:00',
      status: 'completed',
      recipient: 'John Doe'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return '↓';
      case 'withdrawal': return '↑';
      case 'send': return '→';
      case 'receive': return '←';
      default: return '•';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-2xl">
                  {getTransactionIcon(transaction.type)}
                </span>
                <div>
                  <p className="font-medium">
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    {transaction.recipient && ` to ${transaction.recipient}`}
                    {transaction.sender && ` from ${transaction.sender}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.timestamp).toLocaleString()}
                  </p>
                  {transaction.reference && (
                    <p className="text-sm text-gray-500">
                      Ref: {transaction.reference}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {transaction.type === 'withdrawal' || transaction.type === 'send' ? '-' : '+'}
                  ${transaction.amount.toFixed(2)}
                </p>
                <p className={`text-sm ${getStatusColor(transaction.status)}`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}