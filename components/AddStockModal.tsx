import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Button, View, TextInput, TouchableOpacity, Pressable } from "react-native";

import { useDividends } from "@/hooks/useDividends";
import { useStocks } from "@/context/StockContext";
import { useAppColors } from "@/constants/Colors";
import {useCommonStyles} from "@/hooks/useCommonStyles";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import AdBanner from "@/components/AdBanner";
import ModalButton from "@/components/ModalButton";

export default function AddStockModal(props:{
  onClose: () => void;
}) {
  const Colors = useAppColors();
  const CommonStyles = useCommonStyles();
  const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom:50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  inputContainer: {
    flexDirection: "column",
    gap: 12,

  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 8,
    padding: 10,
    backgroundColor: Colors.white,
    color:Colors.primary,

  },
  buttonContainer: {
   flexDirection:'row',
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    gap:5,
    padding:5,
  },
  buttonAdicionar: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 10,
  },
  TextAdicionar: {
    fontSize: 15,
    fontWeight: '500',
    color: 'white',

  }
});
  const [tickers, setTickers] = useState<string[]>([]);
  const [pendingTicker, setPendingTicker] = useState<string | null>(null);
  const [pendingQuantity, setPendingQuantity] = useState<number | null>(null);

  const [selectedApis] = useState<string[]>(["BRAPI"]);
  const [newTicker, setNewTicker] = useState("");
  const [quantity, setQuantity] = useState("0");

  const { dividends, loading } = useDividends(tickers, selectedApis);
  const { stockShares, addStockShare } = useStocks();

  const addTicker = () => {
    const isTickerValid = () =>
      newTicker.trim() && !tickers.includes(newTicker.toUpperCase());
    const isQuantityValid = () => !isNaN(parseInt(quantity));

    if (isTickerValid() && isQuantityValid()) {
      const upperTicker = newTicker.toUpperCase();
      setTickers((prev) => [...prev, upperTicker]); // isso aciona useEffect do hook useDividends

      setPendingTicker(upperTicker); // guarda para uso após dividends atualizarem
      setPendingQuantity(parseInt(quantity));

      setNewTicker("");
      setQuantity("0");
    }
  };
  useEffect(() => {
    if (pendingTicker && pendingQuantity && dividends.length > 0) {
      // Verifica se os dividendos do ticker que foi adicionado já estão prontos
      const hasDividends = dividends.some(
        (div) => div.ticker === pendingTicker
      );
      if (hasDividends) {
        addStockShare(pendingTicker, pendingQuantity, dividends);
        console.log(stockShares);
        setPendingTicker(null);
        setPendingQuantity(null);
      }
    }
  }, [dividends]);

  return (
    <View style={[CommonStyles.container, styles.container, { minHeight: 150, flexGrow: 1 }]}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ThemedText>Carregando...</ThemedText>
        </View>
      ) : (
        <View style={styles.container}>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Adicionar novo ticker (ex: ITUB4)"
              placeholderTextColor={Colors.primary}
              value={newTicker}
              onChangeText={setNewTicker}
            />
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              placeholder="Quantidade de cotas"
              placeholderTextColor={Colors.primary}
              value={quantity}
              onChangeText={setQuantity}
            />
            <View style={styles.buttonContainer}>
              <ModalButton
                onPress={props.onClose}
                title={'Fechar'}
              />
              <ModalButton
                onPress={addTicker}
                title={'Adicionar'}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}