/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Post, UseGuards, Body, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SendMoneyDto } from './dtos/send-money.dto';
import { CurrencyExchangeDto } from './dtos/currency-exchange.dto';
import {
  AccountTransactionData,
  TransferData,
} from './types/transaction.types';

@ApiTags('transactions')
@ApiBearerAuth()
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

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
  @ApiResponse({
    status: 400,
    description: 'Invalid input or insufficient funds',
  })
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
  @ApiResponse({
    status: 400,
    description: 'Invalid input or insufficient funds',
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async sendMoney(@Body() dto: SendMoneyDto) {
    return this.transactionsService.sendMoney(dto);
  }

  @Post('exchange-currency')
  @ApiOperation({ summary: 'Convert money between different currency wallets' })
  @ApiResponse({ status: 201, description: 'Currency exchange successful' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or insufficient funds',
  })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  async exchangeCurrency(@Req() req: any, @Body() dto: CurrencyExchangeDto) {
    return this.transactionsService.convertCurrency(
      req.user.id,
      dto.amount,
      dto.fromCurrency,
      dto.toCurrency,
      dto.description,
    );
  }
}
