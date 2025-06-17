import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Button, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { generateMockStockShares } from "@/data/mockStockShares";
import { useStocks } from "@/context/StockContext";
import { Dividend } from "@/types/dividendTypes";
import { toBRL } from "@/scripts/utils";
import CustomModal from "@/components/CustomModal";

import { CommonStyles } from "@/constants/ConstantStyles";
import { Colors } from "@/constants/Colors";
import {useAuth} from "@/context/AuthContext";

export default function HomeScreen() {
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState("Todos");
  const [selectedMonth, setSelectedMonth] = useState("Todos");
  const [selectedTicker, setSelectedTicker] = useState("Todos");

  const userData = useAuth();
  const { stockShares, getStocksDividendData } = useStocks();
  const data = getStocksDividendData(stockShares);
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
      if(selectedMonth!== "Todos" && selectedYear !== "Todos"){return selectedMonth + ' / ' + selectedYear}
      return ""
    }
    const result = tickerPart()+monthYearPart();
    if(result == ''){
    return "Filtrar"
    }
    return result;
  }
  return (


    <ScrollView scrollEnabled={!isFilterModalVisible}>
      <View style={[CommonStyles.container, styles.container]}>
        <Text style={CommonStyles.headerText}>SIGMA INVEST</Text>

        {!userData && stockShares &&
            <Text>Dados Locais, faça login para sincronizar com a nuvem</Text>
        }
        <View style={styles.section}>
          <Text style={CommonStyles.sectionTitle}>DIVIDENDOS DO MÊS:</Text>
          <Button
            title={getFilterButtonDisplayText()}
            onPress={toggleFilterModal}
            color={Colors.primary}
          />
          <Text style={styles.totalText}>{toBRL(total)}</Text>
        </View>

        <View style={styles.section}>
          {displayDividends.length > 0 ? (
            displayDividends.map((dividend, index) => (
              <View
                key={`${dividend.id}-${index}`}
                style={[CommonStyles.card, styles.dividendItem]}
              >
                <Text style={styles.ticker}>{dividend.ticker}</Text>
                <Text style={styles.quantity}>
                  Cotas: {stockShares?.[dividend.ticker]?.quantity}
                </Text>
                <Text style={styles.label}>Rendimentos:</Text>
                <Text style={styles.value}>
                  {toBRL(
                    dividend.amount *
                      (stockShares?.[dividend.ticker]?.quantity || 0)
                  )}
                </Text>
                <Text style={styles.label}>
                  Data:{" "}
                  {new Date(dividend.paymentDate).toLocaleDateString("pt-BR")}
                </Text>
                <Text style={styles.type}>
                  {dividend.type === "ordinary"
                    ? "Dividendo"
                    : dividend.type === "special"
                    ? "Dividendo Especial"
                    : "JCP"}
                </Text>
              </View>
            ))
          ) : (
            <Text>Nenhum dividendo encontrado</Text>
          )}
        </View>
      </View>

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
                {getAvailableYears(data).map((year) => (
                  <Picker.Item key={year} label={year} value={year} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.label}>Mês:</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedMonth}
                onValueChange={setSelectedMonth}
              >
                {getAvailableMonths(data, selectedYear).map((month) => (
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

          <View style={styles.filterGroup}>
  <Text style={styles.label}>Ticker:</Text>
  <View style={styles.pickerWrapper}>
    <Picker
      selectedValue={selectedTicker}
      onValueChange={setSelectedTicker}
    >
      {getAvailableTickers(data).map((ticker) => (
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 8,
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
