import {ApiConfig, Dividend} from '../types/dividendTypes';
import {DividendService} from "@/services/dividendService";

// Configuração para a API Alpha Vantage
const alphaVantageConfig: ApiConfig = {
  name: 'Alpha Vantage',
  baseUrl: 'https://www.alphavantage.co',
  apiKey: 'SUA_CHAVE_AQUI',
  getStockListEndpoint:'';
  getDividendEndpoint: (ticker: any) => `/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${ticker}&apikey=${this.apiKey}`,
  responseParser: (data:any):Dividend[] => {
    let parsedDividends:Dividend[] = [];
    // Implemente a lógica de parse específica para esta API
    return parsedDividends;
  }
};

// Configuração para a API Yahoo Finance
const yahooFinanceConfig: ApiConfig = {
  name: 'Yahoo Finance',
  baseUrl: 'https://yahoo-finance-api.com',
  getStockListEndpoint:'',
  getDividendEndpoint: (ticker) => `/v1/dividends/${ticker}`,
  responseParser: (data) => {
    let parsedDividends:Dividend[] = [];
    // Lógica de parse para Yahoo Finance
    return parsedDividends;
  }
};

const brapiConfig = {
    name: "Brapi",
    baseUrl: 'https://brapi.dev/api',
    apiKey: '7AYrqS5jDLBXnrturQkFcj',
    getStockListEndpoint:'/quote/list',
    getDividendEndpoint:(ticker:string) =>`/quote${ticker}?token=${this.apiKey}&dividends=true`,
    dividendResponseParser: (data:any):Dividend[] =>{
      let parsedDividends: Dividend[] = [];




      return parsedDividends;
    }
}

export const API_CONFIGS = {
  ALPHA_VANTAGE: alphaVantageConfig,
  YAHOO_FINANCE: yahooFinanceConfig,
  BRAPI: brapiConfig
};