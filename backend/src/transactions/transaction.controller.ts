import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SendMoneyDto } from './dtos/send-money.dto';
import { AccountTransactionData, TransferData } from './types/transaction.types';

@ApiTags('transactions')
@ApiBearerAuth()
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('transfer')
  @ApiOperation({ summary: 'Transfer money between accounts' })
  @ApiResponse({ status: 201, description: 'Transfer successful' })
  @ApiResponse({ status: 400, description: 'Invalid input or insufficient funds' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async transfer(@Body() transferData: TransferData) {
    return this.transactionsService.transfer(
      transferData.fromAccountId,
      transferData.toAccountId,
      transferData.amount,
      transferData.description,
    );
  }

  @Post('deposit')
  @ApiOperation({ summary: 'Deposit money into an account' })
  @ApiResponse({ status: 201, description: 'Deposit successful' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async deposit(@Body() depositData: AccountTransactionData) {
    return this.transactionsService.deposit(
      depositData.accountId,
      depositData.amount,
      depositData.description,
    );
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw money from an account' })
  @ApiResponse({ status: 201, description: 'Withdrawal successful' })
  @ApiResponse({ status: 400, description: 'Invalid input or insufficient funds' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async withdraw(@Body() withdrawalData: AccountTransactionData) {
    return this.transactionsService.withdraw(
      withdrawalData.accountId,
      withdrawalData.amount,
      withdrawalData.description,
    );
  }

  @Post('send-money')
  @ApiOperation({ summary: 'Send money to another account' })
  @ApiResponse({ status: 201, description: 'Money sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or insufficient funds' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async sendMoney(@Body() dto: SendMoneyDto) {
    return this.transactionsService.sendMoney(dto);
  }
}
