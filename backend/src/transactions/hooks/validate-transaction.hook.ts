import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrencyType } from '@prisma/client';

export const ValidateDeposit = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { accountId, amount, description } = request.body;

    if (!accountId || typeof accountId !== 'number') {
      throw new BadRequestException('Invalid account ID');
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      throw new BadRequestException('Invalid amount');
    }

    if (description && typeof description !== 'string') {
      throw new BadRequestException('Invalid description');
    }

    return { accountId, amount, description };
  },
);

export const ValidateWithdrawal = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { accountId, amount, description } = request.body;

    if (!accountId || typeof accountId !== 'number') {
      throw new BadRequestException('Invalid account ID');
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      throw new BadRequestException('Invalid amount');
    }

    if (description && typeof description !== 'string') {
      throw new BadRequestException('Invalid description');
    }

    return { accountId, amount, description };
  },
);

@Injectable()
export class ValidateTransactionHook {
  constructor(private readonly prisma: PrismaService) {}

  async validateSendMoney(
    senderAccountNumber: string,
    receiverAccountNumber: string,
    amount: number,
  ) {
    const sender = await this.prisma.account.findUnique({
      where: { accountNumber: senderAccountNumber },
      include: { balance: true },
    });
    if (!sender) throw new NotFoundException('Sender account not found');

    const receiver = await this.prisma.account.findUnique({
      where: { accountNumber: receiverAccountNumber },
      include: { balance: true },
    });
    if (!receiver) throw new NotFoundException('Receiver account not found');

    if (!sender.balance || sender.balance.available.toNumber() < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    return { sender, receiver };
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
      throw new NotFoundException('Active account not found for user');
    }

    const sourceWallet = account.wallets.find(
      (w) => w.currency === fromCurrency,
    );
    if (!sourceWallet) {
      throw new BadRequestException(`No active ${fromCurrency} wallet found`);
    }

    const targetWallet = account.wallets.find((w) => w.currency === toCurrency);
    if (!targetWallet) {
      throw new BadRequestException(`No active ${toCurrency} wallet found`);
    }

    if (
      !sourceWallet.balance ||
      sourceWallet.balance.available.toNumber() < amount
    ) {
      throw new BadRequestException(
        `Insufficient funds in ${fromCurrency} wallet`,
      );
    }

    return {
      account,
      sourceWallet,
      targetWallet,
    };
  }
}
