import {ApiConfig, Dividend} from '../types/dividendTypes';
import {DividendService} from "@/services/dividendService";



const createBrapiConfig =()=>{
    const apiKey ='7AYrqS5jDLBXnrturQkFcj';

    return{
    name: "Brapi",
    baseUrl: 'https://brapi.dev/api',
    apiKey: apiKey,
    getStockListEndpoint: `/quote/list?token=${apiKey}&type=stock`,
    getDividendEndpoint:(ticker:string) =>`/quote/${ticker}?token=${apiKey}&dividends=true`,
    stockListParser:(data:any):string[] =>{
        let parsedList: string[]= [];
        for(const stock in data){
            parsedList.push()
        }
        return parsedList;
    },
    dividendResponseParser: (data:any):Dividend[] =>{
        if (!data.results || !Array.isArray(data.results)) return [];

        let parsedDividends: Dividend[] = [];

        for(const stockData of data.results){
          if(!stockData?.dividendsData?.cashDividends) continue;

          const ticker = stockData.symbol;
          const cashDividends = stockData.dividendsData.cashDividends;

          for(const dividend of cashDividends){
            if(!dividend.paymentDate) continue;

            const type:()=>'ordinary' | 'special' | 'interest' = ()=>{
              if(dividend.label?.includes('JCP')) return 'interest';
              if(dividend.relatedTo?.includes('pecial')) return 'special';
              return 'ordinary'
              }
            const formatDate = (dateString:string|null)=>{
              return dateString?(dateString.split('T')[0]):('undefined')
            }
            parsedDividends.push({
              id:`${ticker}-${dividend.paymentDate}-${dividend.paymentDate}`,
              ticker:ticker,
              amount:dividend.rate,
              type:type(),
              paymentDate:formatDate(dividend.paymentDate),
              recordDate:formatDate(dividend.lastDatePrior),
              declaredDate: formatDate(dividend.approvedOn),
              currency:'BRL',
              source:'brapi',
              description: `${dividend.label ||'' } - ${dividend.relatedTo || ''}`.trim(),
            })
          }

        }

      return parsedDividends;
    }
}
}

export const API_CONFIGS = {
  BRAPI: createBrapiConfig()
};