import { IsNumber, IsString, IsNotEmpty, IsPositive } from 'class-validator';

export class SendMoneyDto {
  @IsNotEmpty()
  @IsString()
  senderAccountNumber: string;

  @IsNotEmpty()
  @IsString()
  receiverAccountNumber: string;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  amount: number;
}
