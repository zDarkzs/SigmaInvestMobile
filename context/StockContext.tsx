import React, {createContext, useContext, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {string} from "prop-types";
import {ApiConfig} from "@/types/dividendTypes";


interface StockContextType {
    stocks:string[] |null;
    addStock: (stocks:string) => void;
    apiConfig:ApiConfig|null;
    saveStocks:()=>void;
    loadStocks:()=>void;
}
const StockContext = createContext<StockContextType|undefined>(undefined);

export const StockProvider: React.FC<{children:React.ReactNode}> = ({children}) =>{

    const [stocks, setStocks] = useState<string[]>([]);
    const [apiConfig, setApiConfig] = useState<ApiConfig|null>(null);

    const saveStocks: ()=>void = ()=>{

    }
    const loadStocks: ()=>void = ()=>{

    }

    const addStock = (stock:string)=>{
        try{
            stocks.push(stock)
        }catch (e) {
            console.error(e)
        }
    }
     return (
        <StockContext.Provider value={{
            stocks,
            apiConfig,
            addStock,
            saveStocks,
            loadStocks}}>
            {children}
        </StockContext.Provider>
    )
}

export const useStocks:()=> StockContextType = ():StockContextType => {
    const context:StockContextType|undefined = useContext(StockContext);
    if (!context) throw new Error("useAuth must be used within the AuthProvider");
    return context;
};