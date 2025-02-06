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

      const balance = sourceAccount.balance as unknown as number;
      if (balance < amount) {
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
          amount,
          debits: {
            create: [
              {
                amount,
                description,
                walletId: fromAccountId,
              },
            ],
          },
          credits: {
            create: [
              {
                amount,
                description,
                walletId: toAccountId,
              },
            ],
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

      return transaction;
    });
  }

  async sendMoney(dto: SendMoneyDto) {
    const { senderAccountNumber, receiverAccountNumber, amount, description } =
      dto;

    const { sender, receiver } =
      await this.validateTransactionHook.validateSendMoney(
        senderAccountNumber,
        receiverAccountNumber,
        amount,
      );

    return await this.prisma.$transaction(async (prisma) => {
      const transaction = await prisma.transaction.create({
        data: {
          reference: uuidv4(),
          type: OperationType.TRANSFER,
          status: TransactionStatus.COMPLETED,
          amount,
          description: `Transfer from ${senderAccountNumber} to ${receiverAccountNumber}`,
          debits: {
            create: [
              {
                amount,
                description: `Sent to ${receiverAccountNumber}`,
                walletId: sender.id,
              },
            ],
          },
          credits: {
            create: [
              {
                amount,
                description: `Received from ${senderAccountNumber}`,
                walletId: receiver.id,
              },
            ],
          },
        },
      });

      await prisma.account.update({
        where: { id: sender.id },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      await prisma.account.update({
        where: { id: receiver.id },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      return transaction;
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
          amount,
          credits: {
            create: [
              {
                amount,
                description,
                walletId: accountId,
              },
            ],
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

      return transaction;
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

      const balance = account.balance as unknown as number;
      if (balance < amount) {
        throw new BadRequestException('Insufficient funds');
      }

      const transaction = await prisma.transaction.create({
        data: {
          reference: uuidv4(),
          type: OperationType.WITHDRAWAL,
          status: TransactionStatus.PENDING,
          description,
          amount,
          debits: {
            create: [
              {
                amount,
                description,
                walletId: accountId,
              },
            ],
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
