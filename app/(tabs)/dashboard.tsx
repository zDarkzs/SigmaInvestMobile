// Dashboard.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
} from "react-native";
import { useDividends } from "@/hooks/useDividends";
import { API_CONFIGS } from "@/services/apiClients";
import DividendCard from "@/components/DividendCard";
import DividendLineChart from "@/components/DividendLineChart";
import { useStocks } from "@/context/StockContext";
import { CommonStyles } from "@/constants/ConstantStyles";
import {Colors} from "@/constants/Colors";

export default function Dashboard() {
  const [tickers, setTickers] = useState<string[]>([]);
  const [selectedApis, setSelectedApis] = useState<string[]>(["BRAPI"]);
  const [newTicker, setNewTicker] = useState("");
  const [quantity, setQuantity] = useState("0");

  const { dividends, loading, error } = useDividends(tickers, selectedApis);
  const { addStockShare, stockShares } = useStocks();

  const isTickerValid = () =>
    newTicker.trim() !== "" && !tickers.includes(newTicker.toUpperCase());

  const isQuantityValid = () => !isNaN(parseInt(quantity));

  const handleAddTicker = () => {
    if (isTickerValid() && isQuantityValid()) {
      const upperTicker = newTicker.toUpperCase();
      setTickers([...tickers, upperTicker]);
      addStockShare(upperTicker, parseInt(quantity), dividends);
      setNewTicker("");
      setQuantity("0");
    }
  };

  const handleToggleApi = (apiName: string) => {
    setSelectedApis((prev) =>
      prev.includes(apiName)
        ? prev.filter((api) => api !== apiName)
        : [...prev, apiName]
    );
  };

  // Extrair todos os payments de todas as ações
  const allPayments = Object.values(stockShares).flatMap((share) => share.payments);

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
          style={styles.input}
          placeholder="Quantidade de cotas"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
        <View style={styles.buttonContainer}>
          <Button title="Adicionar" onPress={handleAddTicker} />
        </View>
      </View>

      <View style={styles.apiSelector}>
        {Object.keys(API_CONFIGS).map((apiName) => (
          <Button
            key={apiName}
            title={API_CONFIGS[apiName as keyof typeof API_CONFIGS].name}
            onPress={() => handleToggleApi(apiName)}
            color={selectedApis.includes(apiName) ? "green" : "gray"}
          />
        ))}
      </View>

      {loading && <Text>Carregando...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}

      {allPayments.length > 0 ? (
        <DividendLineChart payments={allPayments} />
      ) : (
        <Text style={CommonStyles.warningText}>Sem dados de dividendos no momento.</Text>
      )}

      <FlatList
        data={dividends}
        keyExtractor={(item) => item.id + item.amount}
        renderItem={({ item }) => <DividendCard dividend={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.container,
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "column",
    marginBottom: 16,
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 8,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "white",
  },
  apiSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  error: {
    color: "red",
    marginBottom: 16,
  },
});
