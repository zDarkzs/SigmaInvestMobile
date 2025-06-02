import React, {createContext, useContext, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ApiConfig, Dividend, Stock} from "@/types/dividendTypes";
import {StockShares} from "@/types/dividendTypes";


interface StockContextType {
    stockShares:StockShares |null;
    debugMode: boolean;
    updateStockShares: (tickers:string[],quantity:number[],dividends:Dividend[]) => void;
    addStockShare: (tickers:string,quantity:number,dividends:Dividend[]) => void;
    apiConfig:ApiConfig|null;
    showStocks:()=>void;
    saveStocks:()=>Promise<void>;
    loadStocks:()=>Promise<void>;
    getStocksDividendData: (stockSharesData:StockShares) => any[];
}
const StockContext = createContext<StockContextType|undefined>(undefined);

export const StockProvider: React.FC<{children:React.ReactNode}> = ({children}) =>{

    const [stockShares, setStockShares] = useState<StockShares>({});
    const [debugMode, setDebugMode] = useState(false);
    const [apiConfig, setApiConfig] = useState<ApiConfig|null>(null);



    const showStocks = ()=> console.log(stockShares);
    const saveStocks: ()=>Promise<void> = async ()=>{
        try {
            await AsyncStorage.setItem("stocks", JSON.stringify(stockShares));
        }
        catch (e) {
            console.error(e)
        }
    }
    const loadStocks: ()=>Promise<void> = async ()=>{
            try {
                const StoredData = await AsyncStorage.getItem('stocks');
                setStockShares(StoredData != null ? JSON.parse(StoredData) : []);
            }catch (e) {
                console.error(e)
            }
    }

    const updateStockShares = (tickers:string[],quantity:number[],dividends:Dividend[])=> {
        const dividendTickers = (dividends.map((dividend) => {
            return dividend.ticker
        }))

        console.log(dividendTickers);
        for (const ticker of tickers) {
            stockShares[ticker] = {
                quantity:0,
                payments:dividends.filter((dividend) => dividend.ticker == ticker )
            }
        }
    };

    const addStockShare = (ticker:string, quantity:number,dividends:Dividend[])=>{
        console.log(dividends.map(dividend => dividend.ticker))
        const payments = dividends.filter((dividend) => dividend.ticker == ticker)
        console.log(payments)
        stockShares[ticker]= {
                quantity:quantity,
                payments:payments

        }
        console.log(stockShares);
    }
    const getStocksDividendData = (stockSharesData:StockShares) => {
        return  Object.values(stockSharesData).flatMap(stock =>
            stock.payments.map(payment => ({
            ...payment,
            totalAmount: payment.amount * stock.quantity
            }))
        );

    }
     return (
        <StockContext.Provider value={{
            stockShares,
            debugMode,
            apiConfig,
            showStocks,
            updateStockShares,
            addStockShare,
            saveStocks,
            loadStocks,
            getStocksDividendData}}>
            {children}
        </StockContext.Provider>
    )
}

export const useStocks:()=> StockContextType = () => {
    const context:StockContextType|undefined = useContext(StockContext);
    if (!context) throw new Error("useAuth must be used within the AuthProvider");
    return context;
};