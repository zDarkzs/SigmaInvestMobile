import { useState, useEffect } from 'react';
import { Dividend } from '../types/dividendTypes';
import { DividendService } from '../services/dividendService';
import { API_CONFIGS } from '../services/apiClients';

export const useStocks:(selectApis:string[]) =>string[] = (selectedApis: string[]) =>{
  let stocks: string[] = []
  const [loadingStocks, setLoadingStocks] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(()=>{
    const fetchStocks = async () =>{
      setLoadingStocks(false);
      setError(null);

      try{
        const allStocks: string[] = [];
        for(const apiName of selectedApis){
          const apiConfig = API_CONFIGS[apiName as keyof typeof API_CONFIGS];
          const ap
        }
      }catch (e) {
        setError('erro ao carregar stock');
      }
    }
  })


  return stocks;
}

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
  }, [tickers, selectedApis]);

  return { dividends, loading, error };
};