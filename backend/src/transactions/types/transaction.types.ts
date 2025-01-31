export interface TransferData {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  description?: string;
}

export interface AccountTransactionData {
  accountId: number;
  amount: number;
  description?: string;
}
