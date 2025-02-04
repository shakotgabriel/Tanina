import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TransactionStatus, OperationType, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { SendMoneyDto } from './dtos/send-money.dto';
import { ValidateTransactionHook } from './hooks/validate-transaction.hook';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validateTransactionHook: ValidateTransactionHook,
  ) {}

  async deposit(accountId: number, amount: number, description?: string) {
    return this.creditAccount(accountId, amount, description);
  }

  async withdraw(accountId: number, amount: number, description?: string) {
    return this.debitAccount(accountId, amount, description);
  }

  async transfer(
    fromAccountId: number,
    toAccountId: number,
    amount: number,
    description?: string,
  ) {
    if (amount <= 0) {
      throw new BadRequestException('Transfer amount must be greater than 0');
    }

    return await this.prisma.$transaction(async (prisma) => {
      const sourceAccount = await prisma.account.findUnique({
        where: { id: fromAccountId },
      });

      if (!sourceAccount || !sourceAccount.isActive) {
        throw new NotFoundException('Source account not found or inactive');
      }

      if (sourceAccount.balance < amount) {
        throw new BadRequestException('Insufficient funds');
      }

      const destAccount = await prisma.account.findUnique({
        where: { id: toAccountId },
      });

      if (!destAccount || !destAccount.isActive) {
        throw new NotFoundException(
          'Destination account not found or inactive',
        );
      }

      const transaction = await prisma.transaction.create({
        data: {
          reference: uuidv4(),
          type: OperationType.TRANSFER,
          status: TransactionStatus.PENDING,
          description,
          debits: {
            create: {
              amount,
              accountId: fromAccountId,
              description,
            },
          },
          credits: {
            create: {
              amount,
              accountId: toAccountId,
              description,
            },
          },
        },
      });

      await prisma.account.update({
        where: { id: fromAccountId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      await prisma.account.update({
        where: { id: toAccountId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      const updatedTransaction = await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: TransactionStatus.COMPLETED,
        },
      });

      return updatedTransaction;
    });
  }

  async sendMoney(dto: SendMoneyDto) {
    const { senderAccountNumber, receiverAccountNumber, amount } = dto;

    const { sender, receiver } =
      await this.validateTransactionHook.validateSendMoney(
        senderAccountNumber,
        receiverAccountNumber,
        amount,
      );

    return this.prisma.$transaction(async (prisma) => {
      await prisma.account.update({
        where: { id: sender.id },
        data: { balance: { decrement: amount } },
      });
      await prisma.account.update({
        where: { id: receiver.id },
        data: { balance: { increment: amount } },
      });

      return prisma.transaction.create({
        data: {
          reference: `TXN-${Date.now()}`,
          type: OperationType.TRANSFER,
          status: TransactionStatus.COMPLETED,
          description: `Transfer from ${senderAccountNumber} to ${receiverAccountNumber}`,
          debits: {
            create: {
              amount,
              accountId: sender.id,
              description: `Sent to ${receiverAccountNumber}`,
            },
          },
          credits: {
            create: {
              amount,
              accountId: receiver.id,
              description: `Received from ${senderAccountNumber}`,
            },
          },
        },
      });
    });
  }

  async creditAccount(accountId: number, amount: number, description?: string) {
    if (amount <= 0) {
      throw new BadRequestException('Credit amount must be greater than 0');
    }

    return await this.prisma.$transaction(async (prisma) => {
      const account = await prisma.account.findUnique({
        where: { id: accountId },
      });

      if (!account || !account.isActive) {
        throw new NotFoundException('Account not found or inactive');
      }

      const transaction = await prisma.transaction.create({
        data: {
          reference: uuidv4(),
          type: OperationType.DEPOSIT,
          status: TransactionStatus.PENDING,
          description,
          credits: {
            create: {
              amount,
              accountId,
              description,
            },
          },
        },
      });

      await prisma.account.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      const updatedTransaction = await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: TransactionStatus.COMPLETED,
        },
      });

      return updatedTransaction;
    });
  }

  async debitAccount(accountId: number, amount: number, description?: string) {
    if (amount <= 0) {
      throw new BadRequestException('Debit amount must be greater than 0');
    }

    return await this.prisma.$transaction(async (prisma) => {
      const account = await prisma.account.findUnique({
        where: { id: accountId },
      });

      if (!account || !account.isActive) {
        throw new NotFoundException('Account not found or inactive');
      }

      if (account.balance < amount) {
        throw new BadRequestException('Insufficient funds');
      }

      const transaction = await prisma.transaction.create({
        data: {
          reference: uuidv4(),
          type: OperationType.WITHDRAWAL,
          status: TransactionStatus.PENDING,
          description,
          debits: {
            create: {
              amount,
              accountId,
              description,
            },
          },
        },
      });

      await prisma.account.update({
        where: { id: accountId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      const updatedTransaction = await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: TransactionStatus.COMPLETED,
        },
      });

      return updatedTransaction;
    });
  }

  async getTransactionHistory(accountId: number) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        OR: [
          {
            debits: {
              some: {
                accountId,
              },
            },
          },
          {
            credits: {
              some: {
                accountId,
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
