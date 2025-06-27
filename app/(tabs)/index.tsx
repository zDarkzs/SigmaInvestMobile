import React, { useState } from "react";
import { View, Text, ScrollView, Button, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { useStocks } from "@/context/StockContext";
import { toBRL } from "@/scripts/utils";
import CustomModal from "@/components/CustomModal";
import { CommonStyles } from "@/constants/ConstantStyles";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { ThemedText } from "@/components/ThemedText";
import { useDividendFilter } from "@/hooks/useDividendFilter";

export default function HomeScreen() {
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const toggleFilterModal = () => setFilterModalVisible(!isFilterModalVisible);

  const userData = useAuth();
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

  const total = filteredDividends.reduce(
    (sum, d) => sum + d.amount * (stockShares?.[d.ticker]?.quantity || 0),
    0
  );

  const getFilterButtonDisplayText = () => {
    const tickerPart = () => {
      if (selectedTicker === "Todos") return "";
      if (selectedMonth === "Todos") return selectedTicker;
      return selectedTicker + " : ";
    };
    const monthYearPart = () => {
      if (selectedYear !== "Todos") {
        if (selectedMonth !== "Todos") return `${selectedMonth} / ${selectedYear}`;
        return selectedYear;
      }
      return "";
    };
    const result = tickerPart() + monthYearPart();
    return result === "" ? "Filtrar" : result;
  };

  return (
    <View style={styles.container}>
      <ScrollView scrollEnabled={!isFilterModalVisible}>
        <Text style={CommonStyles.headerText}>SIGMA INVEST</Text>

        <View style={styles.section}>
          <Text style={CommonStyles.sectionTitle}>RENDIMENTOS DO PERÍODO:</Text>
          <Button
            title={getFilterButtonDisplayText()}
            onPress={toggleFilterModal}
            color={Colors.primary}
          />
          <Text style={styles.totalText}>{toBRL(total)}</Text>
        </View>

        <View style={styles.section}>
          {filteredDividends.length > 0 ? (
            filteredDividends.map((dividend, index) => (
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.container,
    alignItems: "center",
    gap: 8,
    flex: 1,
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
