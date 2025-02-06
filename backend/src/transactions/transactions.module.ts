import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transaction.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ValidateTransactionHook } from './hooks/validate-transaction.hook';
import { ExchangeRateService } from '../common/services/exchange-rate.service';
import { TransactionValidatorService } from './services/transaction-validator.service';

@Module({
  imports: [PrismaModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, ValidateTransactionHook, TransactionValidatorService, ExchangeRateService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
