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
      let parsedDividends: Dividend[] = [];
        console.log(data)

      return parsedDividends;
    }
}
}

export const API_CONFIGS = {
  BRAPI: createBrapiConfig()
};