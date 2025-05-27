
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
export interface StockShares{
  [ticker: string]: { quantity:number, payments:Dividend[] };
}

//export function Stocks
export interface ApiConfig{
  name: string;
  baseUrl: string;
  apiKey?: string;
  getDividendEndpoint: (ticker: string) => string;
  dividendResponseParser: (data: any) => Dividend[];
}