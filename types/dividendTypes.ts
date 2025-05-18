export interface Dividend {
  id: string;
  ticker: string;
  amount: number;
  paymentDate: string;
  recordDate?: string;
  declaredDate?: string;
  type?: 'ordinary' | 'special' | 'interest';
  currency: string;
  source: string; // Nome da API de origem
  description:string;
}
export interface ApiConfig{
  name: string;
  baseUrl: string;
  apiKey?: string;
  getStockListEndpoint: string;
  getDividendEndpoint: (ticker: string) => string;
  stockListParser:(data:any) => string[];
  dividendResponseParser: (data: any) => Dividend[];
}