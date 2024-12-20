import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BankingModule } from './banking/banking.module';
import { MobileMoneyModule } from './mobile-money/mobile-money.module';

@Module({
  imports: [UsersModule, TransactionsModule, BankingModule, MobileMoneyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
