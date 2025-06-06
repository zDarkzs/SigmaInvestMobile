import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TextInput, Button, Dimensions} from 'react-native';
import {LineChart} from "react-native-chart-kit";
import { useDividends } from '../../hooks/useDividends';
import { API_CONFIGS } from '../../services/apiClients';
import DividendCard from '../../components/DividendCard';
import DividendLineChart from "@/components/DividendLineChart";
import {useStocks} from "@/context/StockContext";
import {bool} from "prop-types";

export default function Dashboard() {
  const [tickers, setTickers] = useState<string[]>([]);
  const [selectedApis, setSelectedApis] = useState<string[]>([]);
  const [newTicker, setNewTicker] = useState('');
  const [quantity, setQuantity] = useState('0');
  const { dividends, loading, error } = useDividends(tickers, selectedApis);
  const{stockShares,updateStockShares,addStockShare} = useStocks();


  const addTicker = () => {
    const isTickerValid = ():boolean =>{
      return !!(newTicker.trim() && !tickers.includes(newTicker.toUpperCase()));
    }
    const isQuantityValid = ():boolean =>{
      try {
        parseInt(quantity);
      }catch(e){
        return false;
      }
      return true;
    }
    if (isTickerValid() && isQuantityValid()) {
      setTickers([...tickers, newTicker.toUpperCase()]);
    }

  };

  const toggleApi = (apiName: string) => {
    setSelectedApis(prev =>
      prev.includes(apiName)
        ? prev.filter(api => api !== apiName)
        : [...prev, apiName]
    );
  };

  useEffect(()=>{
    addStockShare(newTicker,parseInt(quantity),dividends);
    setNewTicker('');
    setQuantity('0');
  },[dividends])


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dividend Tracker</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Adicionar novo ticker (ex: ITUB4)"
          value={newTicker}
          onChangeText={setNewTicker}
        />
        <TextInput
          keyboardType='numeric'
          style={styles.input}
          placeholder={'Quantidade de cotas'}
          value={quantity}
          onChangeText={setQuantity}
        />
        <View style={styles.buttomContainer}>
          <Button title="Adicionar" onPress={addTicker} />
        </View>
      </View>

      <View style={styles.apiSelector}>
        {Object.keys(API_CONFIGS).map(apiName => (
          <Button
            key={apiName}
            title={API_CONFIGS[apiName as keyof typeof API_CONFIGS].name}
            onPress={() => toggleApi(apiName)}
            color={selectedApis.includes(apiName) ? 'green' : 'gray'}
          />
        ))}
      </View>

      {loading && <Text>Carregando...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      <DividendLineChart dividends={dividends}/>
      <FlatList
        data={dividends}
        keyExtractor={(item) => item.id + item.amount}
        renderItem={({ item }) => <DividendCard dividend={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'column',
    marginBottom: 16,
    justifyContent:'space-between',
    alignItems: 'center',
  },
  buttomContainer:{
    flexDirection:'row'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginRight: 8,
  },
  apiSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
});
