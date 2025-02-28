import { Injectable } from '@nestjs/common';
import { CurrencyType } from '@prisma/client';

@Injectable()
export class ExchangeRateService {
  // In a production environment, this would fetch real-time exchange rates from an API
  private readonly exchangeRates: Record<string, number> = {
    'USD_KES': 130.00,  
    'USD_UGX': 3700.00, 
    'USD_TZS': 2500.00,
    'USD_SSP': 5000.00, 
  };

  getExchangeRate(fromCurrency: CurrencyType, toCurrency: CurrencyType): number {
    if (fromCurrency === toCurrency) {
      return 1;
    }

    const rateKey = `${fromCurrency}_${toCurrency}`;
    const rate = this.exchangeRates[rateKey];

    if (!rate) {
      throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
    }

    return rate;
  }

  convertAmount(amount: number, fromCurrency: CurrencyType, toCurrency: CurrencyType): number {
    const rate = this.getExchangeRate(fromCurrency, toCurrency);
    return amount * rate;
  }
}
