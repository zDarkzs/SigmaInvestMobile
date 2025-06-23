// Dashboard.tsx
import React, {useEffect, useState} from "react";
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
import {Dividend} from "@/types/dividendTypes";

export default function Dashboard() {
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState("Todos");
  const [selectedMonth, setSelectedMonth] = useState("Todos");
  const [selectedTicker, setSelectedTicker] = useState("Todos");
  const [tickers] = useState<string[]>([]);
  const [selectedApis] = useState<string[]>(["BRAPI"]);
  const { dividends, loading, error } = useDividends(tickers, selectedApis);
  const { stockShares,getStocksDividendData } = useStocks();
  const data = stockShares? getStocksDividendData(stockShares) : [];
  const [filteredDividends, setFilteredDividends] = useState<Dividend[]>(
    data || []
  );
    const toggleFilterModal = () => setFilterModalVisible(!isFilterModalVisible);
  const getAvailableTickers = (dividends: Dividend[]) =>
    [
      "Todos",
      ...Array.from(new Set(dividends.map((d) => d.ticker))).sort(),
    ];

  const getAvailableYears = (dividends: Dividend[]) =>
    [
      "Todos",
      ...Array.from(new Set(dividends.map((d) => d.paymentDate.split("-")[0]))),
    ].sort((a, b) => b.localeCompare(a));

  const getAvailableMonths = (dividends: Dividend[], year: string) => {

    const filtered =
      year === "Todos"
        ? dividends
        : dividends.filter((d) => d.paymentDate.startsWith(`${year}-`));

    return [
      "Todos",
      ...Array.from(
        new Set(filtered.map((d) => d.paymentDate.split("-")[1]))
      ).sort((a, b) => parseInt(a) - parseInt(b)),
    ];
  };

  const applyFilters = () => {
    let dividends = data;

    if (selectedYear !== "Todos") {
      dividends = dividends.filter((d) =>
        d.paymentDate.startsWith(`${selectedYear}-`)
      );
    }

    if (selectedMonth !== "Todos") {
      dividends = dividends.filter(
        (d) => d.paymentDate.split("-")[1] === selectedMonth
      );
    }
    if (selectedTicker !== "Todos") {
      dividends = dividends.filter((d) => d.ticker === selectedTicker);
    }

    setFilteredDividends(dividends);
    toggleFilterModal();
  };
  useEffect(() => {
    setSelectedMonth("Todos");
  }, [selectedYear]);
  const resetFilters = () => {
    setSelectedYear("Todos");
    setSelectedMonth("Todos");
    setSelectedTicker("Todos")
    setFilteredDividends(data);
    toggleFilterModal();
  };

  const displayDividends =
    filteredDividends.length > 0 ? filteredDividends : data;
  const total = displayDividends.reduce(
    (sum, d) => sum + d.amount * (stockShares?.[d.ticker]?.quantity || 0),
    0
  );
  const getFilterButtonDisplayText = ()=>{
    const tickerPart = ()=>{
    if(selectedTicker==="Todos"){return ""}
    if(selectedMonth==="Todos"){return selectedTicker}
    return selectedTicker + ' : '
    }
    const monthYearPart = ()=>{
      if(selectedYear!== "Todos"){
        if(selectedMonth !== "Todos")return selectedMonth + ' / ' + selectedYear;
        return selectedYear;
      }
      return ""
    }
    const result = tickerPart()+monthYearPart();
    if(result == ''){
    return "Filtrar"
    }
    return result;
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de dividendos</Text>

      {loading && <Text>Carregando...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}

      {data.length > 0 ? (
        <DividendLineChart payments={data} />
      ) : (
        <Text style={CommonStyles.warningText}>Sem dados de dividendos no momento.</Text>
      )}



      <FlatList
        data={data}
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
