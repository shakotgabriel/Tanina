import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccountType } from '@prisma/client';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async createAccount(
    userId: number,
    accountType: AccountType,
    currency: string = 'SSP',
  ) {
    const accountNumber = this.generateAccountNumber();

    return await this.prisma.account.create({
      data: {
        userId,
        accountType,
        accountNumber,
        currency,
      },
    });
  }

  private generateAccountNumber(): string {
    // Generate a 10-digit account number
    return Math.floor(Math.random() * 9000000000 + 1000000000).toString();
  }

  async getAccountBalance(accountId: number) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      select: { balance: true, currency: true, accountNumber: true },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }
}