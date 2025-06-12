import { useState, useEffect } from 'react';
import { Dividend } from '../types/dividendTypes';
import { DividendService } from '../services/dividendService';
import { API_CONFIGS } from '../services/apiClients';
import {useStocks} from "@/context/StockContext";

export const useDividends = (tickers: string[], selectedApis: string[]) => {
  const [dividends, setDividends] = useState<Dividend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDividends = async () => {
      setLoading(true);
      setError(null);
      try {
        const allDividends: Dividend[] = [];

        for (const apiName of selectedApis) {
          const apiConfig = API_CONFIGS[apiName as keyof typeof API_CONFIGS];
          const apiDividends = await DividendService.getDividends(tickers, apiConfig);
          allDividends.push(...apiDividends);
          console.log(apiName)
          console.log(allDividends)
          console.log(dividends)

        }
        setDividends(allDividends);
      } catch (err) {
        setError('Failed to fetch dividends');
      } finally {
        setLoading(false);
      }
    };
    if (tickers.length > 0 && selectedApis.length > 0) {
      fetchDividends();
    }
  }, [tickers]);

  return { dividends, loading, error };
};

const UsePayments = () =>{

}