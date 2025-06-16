import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiConfig, Dividend, Stock } from "@/types/dividendTypes";
import { StockShares } from "@/types/dividendTypes";
import { useAuth } from "./AuthContext"; // ou o caminho correto
import { db } from "@/services/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import * as FileSystem from "expo-file-system";
import {Platform} from "react-native";
import * as Sharing from "expo-sharing";

interface StockContextType {
  stockShares: StockShares | null;
  debugMode: boolean;
  updateStockShares: (
    tickers: string[],
    quantity: number[],
    dividends: Dividend[]
  ) => void;
  addStockShare: (
    tickers: string,
    quantity: number,
    dividends: Dividend[]
  ) => void;
  apiConfig: ApiConfig | null;
  showStocks: () => void;
  saveStocks: () => Promise<void>;
  loadStocks: () => Promise<void>;
  getStocksDividendData: (stockSharesData: StockShares) => any[];
  resetLocalData: () => Promise<void>;
  exportStockSharesToJSON: () => Promise<string>;
}
const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stockShares, setStockShares] = useState<StockShares>({});
  const [debugMode, setDebugMode] = useState(false);
  const [apiConfig, setApiConfig] = useState<ApiConfig | null>(null);

  const { userData } = useAuth();
  useEffect(() => {
    const loadFromFirebase = async () => {
      if (userData) {
        try {
          const ref = doc(db, "users", userData.uid);
          const snap = await getDoc(ref);

          if (snap.exists() && snap.data().stockShares) {
            setStockShares(snap.data().stockShares);
            await AsyncStorage.setItem(
              "@stockShares",
              JSON.stringify(snap.data().stockShares)
            );
          } else {
            console.log("Nenhum stockShare encontrado no Firestore");
          }
        } catch (error) {
          console.error("Erro ao carregar do Firebase:", error);
        }
        return;
      }
      setStockShares({});
    };

    loadFromFirebase();
  }, [userData]);

  useEffect(() => {
    const loadFromStorage = async () => {
      try {
        const json = await AsyncStorage.getItem("@stockShares");
        if (json) {
          setStockShares(JSON.parse(json));
        }
      } catch (error) {
        console.error("Erro ao carregar do AsyncStorage:", error);
      }
    };
    if(!userData){
    loadFromStorage();
    }
  }, []);

    const saveShares = async () => {
      try {
        const json = JSON.stringify(stockShares);
        await AsyncStorage.setItem("@stockShares", json);

        if (userData) {
          const ref = doc(db, "users", userData.uid);
          await setDoc(ref, { stockShares }, { merge: true });
        }
      } catch (err) {
        console.error("Erro ao salvar dados:", err);
      }
    };
  useEffect(() => {
    console.log("StockShares alterado")
    if (Object.keys(stockShares).length > 0) {
      saveShares();
    }
  }, [stockShares]);

  const showStocks = () => console.log(stockShares);

  const saveStocks: () => Promise<void> = async () => {
    try {
      await AsyncStorage.setItem("stocks", JSON.stringify(stockShares));
    } catch (e) {
      console.error(e);
    }
  };
  const loadStocks: () => Promise<void> = async () => {
    try {
      const StoredData = await AsyncStorage.getItem("stocks");
      setStockShares(StoredData != null ? JSON.parse(StoredData) : {});
    } catch (e) {
      console.error(e);
    }
  };

  const updateStockShares = (
    tickers: string[],
    quantity: number[],
    dividends: Dividend[]
  ) => {
    const dividendTickers = dividends.map((dividend) => {
      return dividend.ticker;
    });

    console.log(dividendTickers);
    for (const ticker of tickers) {
      stockShares[ticker] = {
        quantity: 0,
        payments: dividends.filter((dividend) => dividend.ticker == ticker),
      };
    }
  };

  const addStockShare = (
    ticker: string,
    quantity: number,
    dividends: Dividend[]
  ) => {
    const payments = dividends.filter(
      (dividend) =>
        dividend.ticker.trim().toUpperCase() === ticker.trim().toUpperCase()
    );
    stockShares[ticker] = {
      quantity: quantity,
      payments: payments,
    };
    saveShares()
    saveStocks();
  };
  const getStocksDividendData = (stockSharesData: StockShares) => {
    const dividends = Object.values(stockSharesData).flatMap((stock) =>
      stock.payments.map((payment) => ({
        ...payment,
        totalAmount: payment.amount * stock.quantity,
      }))
    );
    return dividends;
  };

  const resetLocalData = async () =>{
    try {
      setStockShares({})
      await AsyncStorage.clear();
    } catch (e) {
      console.error(e);
    }

  }

  const exportStockSharesToJSON = async () => {
  if (Platform.OS === 'web') {
    const jsonData = JSON.stringify(stockShares, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'stockShares_backup.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    const jsonData = JSON.stringify(stockShares, null, 2);
    const fileUri = `${FileSystem.documentDirectory}stockShares_backup.json`;
    await FileSystem.writeAsStringAsync(fileUri, jsonData, { encoding: FileSystem.EncodingType.UTF8 });
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/json',
      dialogTitle: 'Exportar seus dados',
    });
  }
};

  return (
    <StockContext.Provider
      value={{
        stockShares,
        debugMode,
        apiConfig,
        showStocks,
        updateStockShares,
        addStockShare,
        saveStocks,
        loadStocks,
        getStocksDividendData,
        resetLocalData,
        exportStockSharesToJSON,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStocks: () => StockContextType = () => {
  const context: StockContextType | undefined = useContext(StockContext);
  if (!context) throw new Error("useStock must be used within the StockProvider");
  return context;
};