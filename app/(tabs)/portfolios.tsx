import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Button, View, TextInput } from 'react-native';

import { useDividends } from '@/hooks/useDividends';
import { useStocks } from '@/context/StockContext';
import { Colors } from '@/constants/Colors';
import { CommonStyles } from '@/constants/ConstantStyles';

export default function PortfoliosScreen() {
  const [tickers, setTickers] = useState<string[]>([]);
  const [selectedApis, setSelectedApis] = useState<string[]>(['BRAPI']);
  const [newTicker, setNewTicker] = useState('');
  const [quantity, setQuantity] = useState('0');

  const { dividends } = useDividends(tickers, selectedApis);
  const { stockShares, addStockShare } = useStocks();

  const addTicker = () => {
    const isTickerValid = () => newTicker.trim() && !tickers.includes(newTicker.toUpperCase());
    const isQuantityValid = () => !isNaN(parseInt(quantity));
    console.log(isTickerValid());
    console.log(isQuantityValid());
    if (isTickerValid() && isQuantityValid()) {
      const upperTicker = newTicker.toUpperCase();
      setTickers([...tickers, newTicker.toUpperCase()]);
      addStockShare(upperTicker, parseInt(quantity), dividends);
      setNewTicker('');
      setQuantity('0');
    }
  };


  return (
    <View style={[CommonStyles.container, styles.container]}>
      <Text style={CommonStyles.headerText}>Dividend Tracker</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Adicionar novo ticker (ex: ITUB4)"
          value={newTicker}
          onChangeText={setNewTicker}
        />
        <TextInput
          keyboardType="numeric"
          style={styles.input}
          placeholder="Quantidade de cotas"
          value={quantity}
          onChangeText={setQuantity}
        />
        <View style={styles.buttonContainer}>
          <Button title="Adicionar" onPress={addTicker} color={Colors.primary} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 8,
    padding: 10,
    backgroundColor: Colors.white,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
});
