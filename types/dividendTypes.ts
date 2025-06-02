
export interface Dividend {
  id: string;
  ticker: string;
  amount: number;
  paymentDate: string;
  recordDate?: string;
  declaredDate?: string;
  type?: 'ordinary' | 'special' | 'interest';
  currency: string;
  source: string;
  description:string;
}
export interface Stock {
  quantity:number, payments:Dividend[]
}

export interface StockShares{
  [ticker: string]: Stock;
}

//export function Stocks
export interface ApiConfig{
  name: string;
  baseUrl: string;
  apiKey?: string;
  getDividendEndpoint: (ticker: string) => string;
  dividendResponseParser: (data: any) => Dividend[];
}