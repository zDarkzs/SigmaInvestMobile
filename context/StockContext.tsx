import React, {createContext, useContext, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {string} from "prop-types";
import {ApiConfig, Dividend} from "@/types/dividendTypes";
import {StockShares} from "@/types/dividendTypes";

interface StockContextType {
    stockShares:StockShares |null;
    addStock: (stocks:string) => void;
    apiConfig:ApiConfig|null;
    showStocks:()=>void;
    saveStocks:()=>Promise<void>;
    loadStocks:()=>Promise<void>;

}
const StockContext = createContext<StockContextType|undefined>(undefined);

export const StockProvider: React.FC<{children:React.ReactNode}> = ({children}) =>{

    const [stockShares, setStockShares] = useState<StockShares>({});
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

    const updateStocks = (dividends:Dividend[])=>{
        //amanha eu mapeio essa poha
        let newStocks:StockShares;
        const tickers = []
    }
     return (
        <StockContext.Provider value={{
            stockShares,
            apiConfig,
            showStocks,
            updateStocks,
            saveStocks,
            loadStocks}}>
            {children}
        </StockContext.Provider>
    )
}

export const useStocks:()=> StockContextType = () => {
    const context:StockContextType|undefined = useContext(StockContext);
    if (!context) throw new Error("useAuth must be used within the AuthProvider");
    return context;
};