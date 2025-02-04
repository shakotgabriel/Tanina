import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transaction.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ValidateTransactionHook } from './hooks/validate-transaction.hook';

@Module({
  imports: [PrismaModule],
  providers: [TransactionsService, ValidateTransactionHook],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
