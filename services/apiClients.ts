import { Dividend, ApiConfig } from '../types/dividendTypes';

// Configuração para a API Alpha Vantage
const alphaVantageConfig: ApiConfig = {
  name: 'Alpha Vantage',
  baseUrl: 'https://www.alphavantage.co',
  apiKey: 'SUA_CHAVE_AQUI',
  getDividendEndpoint: (ticker: any) => `/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${ticker}&apikey=${this.apiKey}`,
  responseParser: (data:any) => {
    // Implemente a lógica de parse específica para esta API
    return parsedDividends;
  }
};

// Configuração para a API Yahoo Finance
const yahooFinanceConfig: ApiConfig = {
  name: 'Yahoo Finance',
  baseUrl: 'https://yahoo-finance-api.com',
  getDividendEndpoint: (ticker) => `/v1/dividends/${ticker}`,
  responseParser: (data) => {
    // Lógica de parse para Yahoo Finance
    return parsedDividends;
  }
};

const brapiConfig = {
    name: "Brapi",
    baseUrl: 'https://brapi.dev/api/',
}

export const API_CONFIGS = {
  ALPHA_VANTAGE: alphaVantageConfig,
  YAHOO_FINANCE: yahooFinanceConfig
};