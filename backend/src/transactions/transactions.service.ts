import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionStatus, OperationType, CurrencyType, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { SendMoneyDto } from './dtos/send-money.dto';
import { TransactionValidatorService } from './services/transaction-validator.service';
import { ExchangeRateService } from '../common/services/exchange-rate.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validator: TransactionValidatorService,
    private readonly exchangeRateService: ExchangeRateService,
  ) {}

  private async createTransactionRecord(data: Omit<Prisma.TransactionCreateInput, 'user' | 'account' | 'wallet'> & { 
    userId: number;
    accountId: number;
    walletId: number;
  }) {
    const { userId, accountId, walletId, ...transactionData } = data;
    return this.prisma.transaction.create({
      data: {
        ...transactionData,
        user: {
          connect: { id: userId }
        },
        account: {
          connect: { id: accountId }
        },
        wallet: {
          connect: { id: walletId }
        }
      }
    });
  }

  private async updateWalletBalance(walletId: number, amount: number, isIncrement: boolean) {
    return this.prisma.balance.update({
      where: { walletId },
      data: {
        available: isIncrement ? { increment: amount } : { decrement: amount }
      }
    });
  }

  async deposit(accountId: number, amount: number, description?: string) {
    if (amount <= 0) {
      throw new BadRequestException('Deposit amount must be greater than 0');
    }

    return await this.prisma.$transaction(async (prisma) => {
      const { account, wallet } = await this.validator.validateAccountWallet(
        accountId,
        CurrencyType.USD
      );

      const transaction = await this.createTransactionRecord({
        reference: uuidv4(),
        type: OperationType.DEPOSIT,
        status: TransactionStatus.PENDING,
        description,
        amount,
        sourceCurrency: CurrencyType.USD,
        targetCurrency: CurrencyType.USD,
        userId: account.userId,
        accountId: account.id,
        walletId: wallet.id,
        credits: {
          create: [{
            amount,
            description: `Deposit to account ${account.accountNumber}`,
            walletId: wallet.id,
          }]
        }
      });

      await this.updateWalletBalance(wallet.id, amount, true);

      return await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: TransactionStatus.COMPLETED,
          completedAt: new Date(),
        },
      });
    });
  }

  async withdraw(accountId: number, amount: number, description?: string) {
    if (amount <= 0) {
      throw new BadRequestException('Withdrawal amount must be greater than 0');
    }

    return await this.prisma.$transaction(async (prisma) => {
      const { account, wallet } = await this.validator.validateAccountWallet(
        accountId,
        CurrencyType.USD,
        true,
        amount
      );

      const transaction = await this.createTransactionRecord({
        reference: uuidv4(),
        type: OperationType.WITHDRAWAL,
        status: TransactionStatus.PENDING,
        description,
        amount,
        sourceCurrency: CurrencyType.USD,
        targetCurrency: CurrencyType.USD,
        userId: account.userId,
        accountId: account.id,
        walletId: wallet.id,
        debits: {
          create: [{
            amount,
            description: `Withdrawal from account ${account.accountNumber}`,
            walletId: wallet.id,
          }]
        }
      });

      await this.updateWalletBalance(wallet.id, amount, false);

      return await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: TransactionStatus.COMPLETED,
          completedAt: new Date(),
        },
      });
    });
  }

  async transfer(
    fromAccountId: number,
    toAccountId: number,
    amount: number,
    description?: string,
    currency: CurrencyType = CurrencyType.USD,
  ) {
    if (amount <= 0) {
      throw new BadRequestException('Transfer amount must be greater than 0');
    }

    return await this.prisma.$transaction(async (prisma) => {
      const { 
        sourceAccount,
        sourceWallet,
        destinationAccount,
        destinationWallet
      } = await this.validator.validateTransferAccounts(
        fromAccountId,
        toAccountId,
        amount,
        currency
      );

      const transaction = await this.createTransactionRecord({
        reference: uuidv4(),
        type: OperationType.TRANSFER,
        status: TransactionStatus.PENDING,
        description,
        amount,
        sourceCurrency: currency,
        targetCurrency: currency,
        userId: sourceAccount.userId,
        accountId: sourceAccount.id,
        walletId: sourceWallet.id,
        debits: {
          create: [{
            amount,
            description: `Transfer to ${destinationAccount.accountNumber} (${currency})`,
            walletId: sourceWallet.id,
          }]
        },
        credits: {
          create: [{
            amount,
            description: `Transfer from ${sourceAccount.accountNumber} (${currency})`,
            walletId: destinationWallet.id,
          }]
        }
      });

      await this.updateWalletBalance(sourceWallet.id, amount, false);
      await this.updateWalletBalance(destinationWallet.id, amount, true);

      return await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: TransactionStatus.COMPLETED,
          completedAt: new Date(),
        },
      });
    });
  }

  async sendMoney(dto: SendMoneyDto) {
    const { senderAccountNumber, receiverAccountNumber, amount, description } = dto;

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    return await this.prisma.$transaction(async (prisma) => {
      const {
        sender,
        senderWallet,
        receiver,
        receiverWallet
      } = await this.validator.validateSendMoneyAccounts(
        senderAccountNumber,
        receiverAccountNumber,
        amount
      );

      const transaction = await this.createTransactionRecord({
        reference: uuidv4(),
        type: OperationType.TRANSFER,
        status: TransactionStatus.PENDING,
        description,
        amount,
        sourceCurrency: senderWallet.currency,
        targetCurrency: receiverWallet.currency,
        userId: sender.userId,
        accountId: sender.id,
        walletId: senderWallet.id,
        debits: {
          create: [{
            amount,
            description: `Send money to ${receiverAccountNumber}`,
            walletId: senderWallet.id,
          }]
        },
        credits: {
          create: [{
            amount,
            description: `Received money from ${senderAccountNumber}`,
            walletId: receiverWallet.id,
          }]
        }
      });

      await this.updateWalletBalance(senderWallet.id, amount, false);
      await this.updateWalletBalance(receiverWallet.id, amount, true);

      return await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: TransactionStatus.COMPLETED,
          completedAt: new Date(),
        },
      });
    });
  }

  async convertCurrency(
    userId: number,
    amount: number,
    fromCurrency: CurrencyType,
    toCurrency: CurrencyType,
    description?: string,
  ) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    // Validate the currency exchange request
    const { account, sourceWallet, targetWallet } = 
      await this.validator.validateCurrencyExchange(
        userId,
        amount,
        fromCurrency,
        toCurrency
      );

    return await this.prisma.$transaction(async (prisma) => {
      // Calculate conversion
      const exchangeRate = this.exchangeRateService.getExchangeRate(fromCurrency, toCurrency);
      const convertedAmount = this.exchangeRateService.convertAmount(amount, fromCurrency, toCurrency);

      // Create transaction
      const transaction = await this.createTransactionRecord({
        reference: uuidv4(),
        type: OperationType.CURRENCY_EXCHANGE,
        status: TransactionStatus.PENDING,
        description: description || `Convert ${amount} ${fromCurrency} to ${toCurrency}`,
        amount,
        sourceCurrency: fromCurrency,
        targetCurrency: toCurrency,
        exchangeRate,
        userId: account.userId,
        accountId: account.id,
        walletId: sourceWallet.id,
        debits: {
          create: [
            {
              amount,
              description: `Debit ${amount} ${fromCurrency} for conversion to ${toCurrency}`,
              walletId: sourceWallet.id,
            },
          ],
        },
        credits: {
          create: [
            {
              amount: convertedAmount,
              description: `Credit ${convertedAmount} ${toCurrency} converted from ${amount} ${fromCurrency}`,
              walletId: targetWallet.id,
            },
          ],
        },
      });

      // Update source wallet balance
      await this.updateWalletBalance(sourceWallet.id, amount, false);

      // Update target wallet balance
      await this.updateWalletBalance(targetWallet.id, convertedAmount, true);

      // Update transaction status
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: TransactionStatus.COMPLETED,
          completedAt: new Date(),
        },
      });

      return {
        transaction,
        sourceAmount: amount,
        targetAmount: convertedAmount,
        exchangeRate,
        fromCurrency,
        toCurrency,
      };
    });
  }

  async creditAccount(accountId: number, amount: number, description?: string) {
    if (amount <= 0) {
      throw new BadRequestException('Credit amount must be greater than 0');
    }

    return await this.prisma.$transaction(async (prisma) => {
      const account = await this.prisma.account.findUnique({
        where: { id: accountId },
        include: { 
          balance: true,
          wallets: {
            where: { isActive: true },
            take: 1
          }
        },
      });

      if (!account || !account.isActive) {
        throw new NotFoundException('Account not found or inactive');
      }

      const wallet = account.wallets[0];
      if (!wallet) {
        throw new BadRequestException('No active wallet found for account');
      }

      const transaction = await this.createTransactionRecord({
        reference: uuidv4(),
        type: OperationType.DEPOSIT,
        status: TransactionStatus.PENDING,
        description,
        amount,
        sourceCurrency: account.currency,
        targetCurrency: account.currency,
        userId: account.userId,
        accountId: account.id,
        walletId: wallet.id,
        credits: {
          create: [
            {
              amount,
              description,
              walletId: wallet.id,
            },
          ],
        },
      });

      await this.updateWalletBalance(wallet.id, amount, true);

      // Update transaction status
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: TransactionStatus.COMPLETED,
          completedAt: new Date(),
        },
      });

      return transaction;
    });
  }

  async debitAccount(accountId: number, amount: number, description?: string) {
    if (amount <= 0) {
      throw new BadRequestException('Debit amount must be greater than 0');
    }

    return await this.prisma.$transaction(async (prisma) => {
      const account = await this.prisma.account.findUnique({
        where: { id: accountId },
        include: { 
          balance: true,
          wallets: {
            where: { isActive: true },
            take: 1
          }
        },
      });

      if (!account || !account.isActive) {
        throw new NotFoundException('Account not found or inactive');
      }

      if (!account.balance || account.balance.available.toNumber() < amount) {
        throw new BadRequestException('Insufficient funds');
      }

      const wallet = account.wallets[0];
      if (!wallet) {
        throw new BadRequestException('No active wallet found for account');
      }

      const transaction = await this.createTransactionRecord({
        reference: uuidv4(),
        type: OperationType.WITHDRAWAL,
        status: TransactionStatus.PENDING,
        description,
        amount,
        sourceCurrency: account.currency,
        targetCurrency: account.currency,
        userId: account.userId,
        accountId: account.id,
        walletId: wallet.id,
        debits: {
          create: [
            {
              amount,
              description,
              walletId: wallet.id,
            },
          ],
        },
      });

      await this.updateWalletBalance(wallet.id, amount, false);

      // Update transaction status
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: TransactionStatus.COMPLETED,
          completedAt: new Date(),
        },
      });

      return transaction;
    });
  }

  async getTransactionHistory(accountId: number) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        OR: [
          {
            debits: {
              some: {
                wallet: {
                  is: {
                    id: accountId,
                  },
                },
              },
            },
          },
          {
            credits: {
              some: {
                wallet: {
                  is: {
                    id: accountId,
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        debits: true,
        credits: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return transactions;
  }
}
