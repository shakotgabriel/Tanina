import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsPositive,
  IsOptional,
} from 'class-validator';

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

  @IsOptional()
  @IsString()
  description?: string;
}
