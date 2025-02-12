/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Account, CurrencyType, Wallet } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class TransactionValidatorService {
  constructor(private readonly prisma: PrismaService) {}

  async validateAccountBalance(
    accountId: number,
    amount: number,
  ): Promise<Account> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: { balance: true },
    });

    if (!account || !account.isActive) {
      throw new NotFoundException('Account not found or inactive');
    }

    if (!account.balance || account.balance.available.toNumber() < amount) {
      throw new BadRequestException('Insufficient funds');
    }

    return account;
  }

  async validateAccountWallet(
    accountId: number,
    currency: CurrencyType,
    requireBalance = false,
    minBalance?: number,
  ): Promise<{ account: Account; wallet: Wallet }> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: {
        balance: true,
        wallets: {
          where: {
            isActive: true,
            currency,
          },
          take: 1,
          include: { balance: true },
        },
      },
    });

    if (!account || !account.isActive) {
      throw new NotFoundException('Account not found or inactive');
    }

    const wallet = account.wallets[0];
    if (!wallet) {
      throw new BadRequestException(
        `No active ${currency} wallet found for account`,
      );
    }

    if (
      requireBalance &&
      (!wallet.balance ||
        wallet.balance.available.toNumber() < (minBalance ?? 0))
    ) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    return { account, wallet };
  }

  async validateTransferAccounts(
    fromAccountId: number,
    toAccountId: number,
    amount: number,
    currency: CurrencyType,
  ) {
    // Validate source account and wallet
    const source = await this.validateAccountWallet(
      fromAccountId,
      currency,
      true,
      amount,
    );

    // Validate destination account and wallet
    const destination = await this.validateAccountWallet(toAccountId, currency);

    return {
      sourceAccount: source.account,
      sourceWallet: source.wallet,
      destinationAccount: destination.account,
      destinationWallet: destination.wallet,
    };
  }

  async validateSendMoneyAccounts(
    senderAccountNumber: string,
    receiverAccountNumber: string,
    amount: number,
  ) {
    const sender = await this.prisma.account.findUnique({
      where: { accountNumber: senderAccountNumber },
      include: {
        balance: true,
        wallets: {
          where: { isActive: true },
          take: 1,
          include: { balance: true },
        },
      },
    });

    if (!sender || !sender.isActive) {
      throw new NotFoundException('Sender account not found or inactive');
    }

    if (!sender.balance || sender.balance.available.toNumber() < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const receiver = await this.prisma.account.findUnique({
      where: { accountNumber: receiverAccountNumber },
      include: {
        wallets: {
          where: { isActive: true },
          take: 1,
          include: { balance: true },
        },
      },
    });

    if (!receiver || !receiver.isActive) {
      throw new NotFoundException('Receiver account not found or inactive');
    }

    return {
      sender,
      senderWallet: sender.wallets[0],
      receiver,
      receiverWallet: receiver.wallets[0],
    };
  }

  async validateCurrencyExchange(
    userId: number,
    amount: number,
    fromCurrency: CurrencyType,
    toCurrency: CurrencyType,
  ) {
    if (fromCurrency === toCurrency) {
      throw new BadRequestException(
        'Source and target currencies must be different',
      );
    }

    // Get user's account with both currency wallets
    const account = await this.prisma.account.findFirst({
      where: {
        userId,
        isActive: true,
      },
      include: {
        wallets: {
          where: {
            isActive: true,
            currency: {
              in: [fromCurrency, toCurrency],
            },
          },
          include: {
            balance: true,
          },
        },
      },
    });

    if (!account) {
      throw new NotFoundException('No active account found for user');
    }

    const sourceWallet = account.wallets.find(
      (w) => w.currency === fromCurrency,
    );
    if (!sourceWallet) {
      throw new BadRequestException(
        `No active wallet found for ${fromCurrency}`,
      );
    }

    const targetWallet = account.wallets.find((w) => w.currency === toCurrency);
    if (!targetWallet) {
      throw new BadRequestException(`No active wallet found for ${toCurrency}`);
    }

    if (
      !sourceWallet.balance ||
      sourceWallet.balance.available.toNumber() < amount
    ) {
      throw new BadRequestException(
        `Insufficient balance in ${fromCurrency} wallet`,
      );
    }

    return {
      account,
      sourceWallet,
      targetWallet,
    };
  }
}
