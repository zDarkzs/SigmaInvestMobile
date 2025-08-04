import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Pressable
} from "react-native";
import { useDividends } from "@/hooks/useDividends";
import { API_CONFIGS } from "@/services/apiClients";
import DividendCard from "@/components/DividendCard";
import DividendLineChart from "@/components/DividendLineChart";
import { useStocks } from "@/context/StockContext";
import { CommonStyles } from "@/constants/ConstantStyles";
import CustomModal from "@/components/CustomModal";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "@/constants/Colors";
import { useDividendFilter } from "@/hooks/useDividendFilter";
import AdBanner from "@/components/AdBanner";

export default function Dashboard() {
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const toggleFilterModal = () => setFilterModalVisible(!isFilterModalVisible);

  const [tickers] = useState<string[]>([]);
  const [selectedApis] = useState<string[]>(["BRAPI"]);
  const { stockShares, getStocksDividendData } = useStocks();
  const dividends = stockShares ? getStocksDividendData(stockShares) : [];

  const {
    selectedYear,
    selectedMonth,
    selectedTicker,
    setSelectedYear,
    setSelectedMonth,
    setSelectedTicker,
    filteredDividends,
    availableYears,
    availableMonths,
    availableTickers,
    resetFilters,
  } = useDividendFilter(dividends);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de dividendos</Text>

      {dividends.length > 0 ? (
          <>
        <DividendLineChart payments={(filteredDividends.length>0?filteredDividends:dividends)} />

      <Pressable
        onPress={toggleFilterModal}
        style={({ pressed }) => [
          styles.buttonFiltrar,{ backgroundColor: pressed ? Colors.primaryDark : Colors.primary } ]}>
        <Text style={styles.TextFiltrar}>Filtrar</Text>
      </Pressable>

      <FlatList
        data={filteredDividends}
        keyExtractor={(item) => Object.values(item).toString()}
        renderItem={({ item }) => <DividendCard dividend={item} />}
        contentContainerStyle={styles.list}
      />

      <CustomModal title="Filtrar Ativos" visible={isFilterModalVisible} onClose={toggleFilterModal}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Filtrar Dividendos</Text>

          <View style={styles.filterGroup}>
            <Text style={styles.label}>Ano:</Text>
            <View style={styles.pickerWrapper}>
              <Picker selectedValue={selectedYear} onValueChange={setSelectedYear}>
                {availableYears.map((year) => (
                  <Picker.Item key={year} label={year} value={year} />
                ))}
              </Picker>
            </View>
          </View>

          {selectedYear !== "Todos" && (
            <View style={styles.filterGroup}>
              <Text style={styles.label}>Mês:</Text>
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={selectedMonth} onValueChange={setSelectedMonth}>
                  {availableMonths.map((month) => (
                    <Picker.Item
                      key={month}
                      label={month === "Todos" ? "Todos" : `${month}/${selectedYear}`}
                      value={month}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}

          <View style={styles.filterGroup}>
            <Text style={styles.label}>Ticker:</Text>
            <View style={styles.pickerWrapper}>
              <Picker selectedValue={selectedTicker} onValueChange={setSelectedTicker}>
                {availableTickers.map((ticker) => (
                  <Picker.Item key={ticker} label={ticker} value={ticker} />
                ))}
              </Picker>
            </View>
          </View>

          <View>
            <Button title="Limpar Filtros" onPress={resetFilters} color="#666" />
          </View>
        </View>
      </CustomModal>
          </>
   ) : (
        <Text style={CommonStyles.warningText}>Sem dados de dividendos no momento.</Text>
      )}
      <AdBanner/>
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
    color: Colors.text,
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
  section: {
    width: "90%",
    alignItems: "center",
    marginBottom: 20,
  },
  totalText: {
    color: "green",
    fontSize: 32,
    fontWeight: "500",
    marginTop: 10,
  },
  dividendItem: {
    width: "100%",
    borderLeftWidth: 5,
    borderLeftColor: Colors.primary,
  },
  ticker: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
  },
  quantity: {
    fontSize: 16,
    color: Colors.primary,
  },
  value: {
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    color: Colors.primary,
  },
  type: {
    fontSize: 16,
    marginTop: 10,
    fontStyle: "italic",
    color: Colors.primary,
  },
  modal: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  filterGroup: {
    marginBottom: 15,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 8,
    overflow: "hidden",
  },
  buttonFiltrar: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    alignItems: 'center'
  },
  TextFiltrar: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  }
})