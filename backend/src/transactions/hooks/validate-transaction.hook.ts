import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

export const ValidateTransfer = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { fromAccountId, toAccountId, amount, description } = request.body;

    if (!fromAccountId || typeof fromAccountId !== 'number') {
      throw new BadRequestException('Invalid source account ID');
    }

    if (!toAccountId || typeof toAccountId !== 'number') {
      throw new BadRequestException('Invalid destination account ID');
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      throw new BadRequestException('Invalid amount');
    }

    if (description && typeof description !== 'string') {
      throw new BadRequestException('Invalid description');
    }

    return { fromAccountId, toAccountId, amount, description };
  },
);

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
