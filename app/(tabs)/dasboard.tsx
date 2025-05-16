import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import { useDividends } from '../../hooks/useDividends';
import { API_CONFIGS } from '../../services/apiClients';
import DividendCard from './DividendCard';

export default function Dashboard() {
  const [tickers, setTickers] = useState<string[]>(['PETR4', 'VALE3']);
  const [selectedApis, setSelectedApis] = useState<string[]>(['ALPHA_VANTAGE']);
  const [newTicker, setNewTicker] = useState('');

  const { dividends, loading, error } = useDividends(tickers, selectedApis);

  const addTicker = () => {
    if (newTicker.trim() && !tickers.includes(newTicker.toUpperCase())) {
      setTickers([...tickers, newTicker.toUpperCase()]);
      setNewTicker('');
    }
  };

  const toggleApi = (apiName: string) => {
    setSelectedApis(prev =>
      prev.includes(apiName)
        ? prev.filter(api => api !== apiName)
        : [...prev, apiName]
    );
  };

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
        <Button title="Adicionar" onPress={addTicker} />
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

      <FlatList
        data={dividends}
        keyExtractor={(item) => item.id}
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
    flexDirection: 'row',
    marginBottom: 16,
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
