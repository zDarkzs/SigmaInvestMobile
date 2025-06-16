import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import {StockShares} from "@/types/dividendTypes";

export const exportStockSharesToJSON = async (stockShares: StockShares) => {
  try {
    const jsonData = JSON.stringify(stockShares, null, 2);
    const fileName = 'stockShares_backup.json';
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    // Salvar o arquivo localmente
    await FileSystem.writeAsStringAsync(fileUri, jsonData, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      // Compartilhar ou salvar usando o menu do sistema
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Exportar seus dados',
      });
    } else {
      console.log('Arquivo salvo:', fileUri);
    }

    return fileUri;
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    throw error;
  }
};

export const exportStockSharesToCSV = async (stockShares: Record<string, StockShares>) => {
  try {
    let csvContent = 'Ticker,Quantidade,Preço Médio\n';

    Object.keys(stockShares).forEach((ticker) => {
      const stock = stockShares[ticker];
      csvContent += `${ticker},${stock.quantity},${stock.averagePrice}\n`;
    });

    const fileName = 'stockShares_backup.csv';
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Exportar seus dados como CSV',
      });
    } else {
      console.log('Arquivo CSV salvo em:', fileUri);
    }

    return fileUri;
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    throw error;
  }
};
