import { createParamDecorator, ExecutionContext, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

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

  async validateSendMoney(senderAccountNumber: string, receiverAccountNumber: string, amount: number) {
    const sender = await this.prisma.account.findUnique({ where: { accountNumber: senderAccountNumber } });
    if (!sender) throw new NotFoundException('Sender account not found');

    const receiver = await this.prisma.account.findUnique({ where: { accountNumber: receiverAccountNumber } });
    if (!receiver) throw new NotFoundException('Receiver account not found');

    const balance = sender.balance as unknown as number;
    if (balance < amount) throw new BadRequestException('Insufficient balance');

    return { sender, receiver };
  }
}
