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
import {FilterParams, InitializeFilter, Variables} from "@/scripts/dividendFiltering";
import CustomModal from "@/components/CustomModal";
import {Picker} from "@react-native-picker/picker";
import {Colors} from "@/constants/Colors";

export default function Dashboard() {
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState("Todos");
  const [selectedMonth, setSelectedMonth] = useState("Todos");
  const [selectedTicker, setSelectedTicker] = useState("Todos");
  const [tickers] = useState<string[]>([]);
  const [selectedApis] = useState<string[]>(["BRAPI"]);
  const { dividends, loading, error } = useDividends(tickers, selectedApis);
  const { stockShares,getStocksDividendData } = useStocks();
  const toggleFilterModal = ()=> setFilterModalVisible(!isFilterModalVisible);
  const [data,setData] = useState<FilterParams>(
      {
        unfilteredDividends:stockShares?getStocksDividendData(stockShares):[],
        selectedYear:"Todos",
        selectedMonth:"Todos",
        selectedTicker:"Todos",
      }
  );
  const [filterVariables, setFilterVariables] = useState<Variables>(InitializeFilter(data));
  const [currentDividends,setCurrenteDividends]= useState<Dividend[]>([])
  const applyFilters = ()=>{}
  const resetFilters = ()=>{}
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
       {/* Modal de Filtro */}
      <CustomModal title={'Filtrar Ativos'} visible={isFilterModalVisible} onClose={toggleFilterModal}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Filtrar Dividendos</Text>

          <View style={styles.filterGroup}>
            <Text style={styles.label}>Ano:</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedYear}
                onValueChange={setSelectedYear}
              >
                {filterVariables.availableYears.map((year) => (
                  <Picker.Item key={year} label={year} value={year} />
                ))}
              </Picker>
            </View>
          </View>
          {selectedYear !== "Todos" &&

          <View style={styles.filterGroup}>
            <Text style={styles.label}>Mês:</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedMonth}
                onValueChange={setSelectedMonth}
                enabled={selectedYear !== "Todos"}
              >
                {filterVariables.availableMonths.map((month) => (
                  <Picker.Item
                    key={month}
                    label={
                      month === "Todos"
                        ? "Todos"
                        : `${month}/${
                            selectedYear === "Todos" ? "" : selectedYear
                          }`
                    }
                    value={month}
                  />
                ))}
              </Picker>
            </View>
          </View>
          }

          <View style={styles.filterGroup}>
  <Text style={styles.label}>Ticker:</Text>
  <View style={styles.pickerWrapper}>
    <Picker
      selectedValue={selectedTicker}
      onValueChange={setSelectedTicker}
    >
      {filterVariables.availableTickers.map((ticker) => (
        <Picker.Item key={ticker} label={ticker} value={ticker} />
      ))}
    </Picker>
  </View>
</View>
          <View>
            <Button
              title="Aplicar Filtros"
              onPress={applyFilters}
              color={Colors.primary}
            />
            <View style={{ margin: 5 }} />
            <Button
              title="Limpar Filtros"
              onPress={resetFilters}
              color="#666"
            />
          </View>
        </View>
      </CustomModal>
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
});
