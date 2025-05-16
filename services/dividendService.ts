import axios from 'axios';
import { Dividend, ApiConfig } from '../types/dividendTypes';
import { API_CONFIGS } from './apiClients';

export class DividendService {
  static async getStocks(apiConfig:ApiConfig):Promise<string[]>{
    const allStocks: string[] = [];
    return allStocks;
  }

  static async getDividends(
    tickers: string[],
    apiConfig: ApiConfig
  ): Promise<Dividend[]> {
    try {
      const allDividends: Dividend[] = [];

      for (const ticker of tickers) {
        const response = await axios.get(
          `${apiConfig.baseUrl}${apiConfig.getDividendEndpoint(ticker)}`
        );

        const dividends = apiConfig.responseParser(response.data);
        allDividends.push(...dividends);
      }

      return this.standardizeDividends(allDividends);
    } catch (error) {
      console.error(`Error fetching from ${apiConfig.name}:`, error);
      return [];
    }
  }

  private static standardizeDividends(dividends: Dividend[]): Dividend[] {
    return dividends.map(dividend => ({
      ...dividend,
      amount: Number(dividend.amount.toFixed(2)), // Padroniza casas decimais
      currency: dividend.currency.toUpperCase(),
      paymentDate: this.formatDate(dividend.paymentDate),
      recordDate: dividend.recordDate ? this.formatDate(dividend.recordDate) : undefined
    }));
  }

  private static formatDate(dateString: string): string {
    // Implemente sua lógica de formatação de data
    return formattedDate;
  }
}