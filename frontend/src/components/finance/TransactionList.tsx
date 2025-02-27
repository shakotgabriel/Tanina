import { Transaction } from '@/types/finance.types'

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="p-4 border rounded-lg">
          <div className="flex justify-between">
            <span className="font-medium">{transaction.type}</span>
            <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
              {transaction.amount} {transaction.currency}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {transaction.status} • {new Date(transaction.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  )
}
