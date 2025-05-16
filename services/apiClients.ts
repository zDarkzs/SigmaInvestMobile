import {ApiConfig, Dividend} from '../types/dividendTypes';
import {DividendService} from "@/services/dividendService";



const brapiConfig = {
    name: "Brapi",
    baseUrl: 'https://brapi.dev/api',
    apiKey: '7AYrqS5jDLBXnrturQkFcj',
    getStockListEndpoint: `/quote/list?token=${this.apiKey}&type=stock`,
    getDividendEndpoint:(ticker:string) =>`/quote/${ticker}?token=${this.apiKey}&dividends=true`,
    stockListParser:(data:any):string[] =>{

        let parsedList: string[]= [];
        for(const stock in data){
            parsedList.push()
        }

        return parsedList;
    },
    dividendResponseParser: (data:any):Dividend[] =>{
      let parsedDividends: Dividend[] = [];
        console.log(data)

      return parsedDividends;
    }
}

export const API_CONFIGS = {
  BRAPI: brapiConfig
};