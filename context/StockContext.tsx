import React, {createContext, useContext, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {string} from "prop-types";
import {ApiConfig} from "@/types/dividendTypes";


interface StockContextType {
    stocks:string[] |null;
    addStock: (stocks:string) => void;
    apiConfig:ApiConfig|null;
    showStocks:()=>void;
    saveStocks:()=>Promise<void>;
    loadStocks:()=>Promise<void>;

}
const StockContext = createContext<StockContextType|undefined>(undefined);

export const StockProvider: React.FC<{children:React.ReactNode}> = ({children}) =>{

    const [stocks, setStocks] = useState<string[]>([]);
    const [apiConfig, setApiConfig] = useState<ApiConfig|null>(null);

    const showStocks = ()=> console.log(stocks);

    const saveStocks: ()=>Promise<void> = async ()=>{
        try {
            await AsyncStorage.setItem("stocks", JSON.stringify(stocks));
        }
        catch (e) {
            console.error(e)
        }
    }
    const loadStocks: ()=>Promise<void> = async ()=>{
            try {
                const StoredData = await AsyncStorage.getItem('stocks');
                setStocks(StoredData != null ? JSON.parse(StoredData) : []);
            }catch (e) {
                console.error(e)
            }
    }

    const addStock = (stock:string)=>{
        stocks.push(stock)
    }
     return (
        <StockContext.Provider value={{
            stocks,
            apiConfig,
            showStocks,
            addStock,
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