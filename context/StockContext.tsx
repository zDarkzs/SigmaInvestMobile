import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiConfig, Dividend, Stock } from "@/types/dividendTypes";
import { StockShares } from "@/types/dividendTypes";
import { useAuth } from "./AuthContext"; // ou o caminho correto
import { db } from "@/services/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {Alert, Platform} from "react-native";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from 'expo-file-system';

interface StockContextType {
  stockShares: StockShares | null;
  debugMode: boolean;
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
  resetStockData: () => Promise<void>;
  resetLocalData: () => Promise<void>;
  exportStockSharesToJSON: () => Promise<void>;
  exportStockSharesToCSV: () => Promise<void>;
  importJSONData: () => Promise<StockShares>;
  compareImportedWithCurrent:(imported: StockShares) => void;
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


const addStockShare = (
  ticker: string,
  quantity: number,
  dividends: Dividend[]
) => {
  const payments = dividends.filter(
    (dividend) =>
      dividend.ticker.trim().toUpperCase() === ticker.trim().toUpperCase()
  );
  setStockShares((prevShares) => ({ // Usar callback para garantir o estado mais recente
    ...prevShares,
    [ticker]: {
      quantity: quantity,
      payments: payments,
    },
  }));
  // saveShares() e saveStocks() serão chamados pelo useEffect que monitora stockShares
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

  const resetStockData = async ()=>{
    setStockShares({});
    if(!userData){
      try {
        await AsyncStorage.clear();
      }catch (e){
        console.error(e);
      }
    }
  }

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
const exportStockSharesToCSV = async () => {
  try {
    let csvContent = 'sep=;\n'; // Faz o Excel entender que o separador é ";"
    csvContent += 'Ticker;Quantidade;Tipo de Pagamento;Valor por Cota;Data de Pagamento;Total Recebido\n';

    Object.keys(stockShares).forEach((ticker) => {
      const stock = stockShares[ticker];

      stock.payments.forEach((payment) => {
        const totalReceived = (payment.amount || 0) * stock.quantity;
        const paymentType =
          payment.type === 'ordinary'
            ? 'Dividendo'
            : payment.type === 'special'
            ? 'Dividendo Especial'
            : 'JCP';

        csvContent += `${ticker};${stock.quantity};${paymentType};${payment.amount.toFixed(4).replace('.', ',')};${payment.paymentDate};${totalReceived.toFixed(2).replace('.', ',')}\n`;
      });
    });

    if (Platform.OS === 'web') {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'stockShares_payments.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const fileUri = `${FileSystem.documentDirectory}stockShares_payments.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csvContent, { encoding: FileSystem.EncodingType.UTF8 });
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Exportar Dividendos em CSV',
      });
    }
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
  }
};



const importJSONData:()=>Promise<StockShares> = async ()=>{
  try{
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory:true,
    })
    console.log(result)
    const JsonUri = result.assets?.[0].uri;
    if (result.canceled || !JsonUri) return {};
    const JsonContent = await FileSystem.readAsStringAsync(JsonUri);

    const data:StockShares = JSON.parse(JsonContent);
    console.log(data)
    if(!data){
      Alert.alert("Erro","Arquivo inválido!");
      return {};
    }
    return data;


  }catch (error){
    console.error('Erro ao importar JSON:', error);
    return {};
  }
}

const compareImportedWithCurrent = (
  imported: StockShares
): void => {
  setStockShares((prevShares) => {
    const newStockShares = { ...prevShares };
    for (const ticker in imported) {
      if (!newStockShares[ticker]) { // Verificar na nova cópia
        newStockShares[ticker] = imported[ticker];
      }
    }
    return newStockShares;
  });
};

  return (
    <StockContext.Provider
      value={{
        stockShares,
        debugMode,
        apiConfig,
        showStocks,
        addStockShare,
        saveStocks,
        loadStocks,
        getStocksDividendData,
        resetStockData,
        resetLocalData,
        exportStockSharesToJSON,
        exportStockSharesToCSV,
        importJSONData,
        compareImportedWithCurrent,
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