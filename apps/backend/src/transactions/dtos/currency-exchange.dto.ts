import {
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsString,
  IsOptional,
  Min,
} from 'class-validator';
import { CurrencyType } from '@prisma/client';

export class CurrencyExchangeDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNotEmpty()
  @IsEnum(CurrencyType)
  fromCurrency: CurrencyType;

  @IsNotEmpty()
  @IsEnum(CurrencyType)
  toCurrency: CurrencyType;

  @IsOptional()
  @IsString()
  description?: string;
}
