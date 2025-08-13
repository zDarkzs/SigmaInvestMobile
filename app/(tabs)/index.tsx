import React, {useEffect, useMemo, useState} from "react";
import {View, Text, ScrollView, Button, StyleSheet, Pressable, Image, Dimensions} from "react-native";
import { Picker } from "@react-native-picker/picker";

import { useStocks } from "@/context/StockContext";
import { toBRL } from "@/scripts/utils";
import CustomModal from "@/components/CustomModal";
import { CommonStyles } from "@/constants/ConstantStyles";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { useDividendFilter } from "@/hooks/useDividendFilter";
import AdBanner from "@/components/AdBanner";
import AddStockModal from "@/components/AddStockModal";
import DividendLineChart from "@/components/DividendLineChart";
import ModalButton from "@/components/ModalButton";

export default function HomeScreen() {
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const toggleFilterModal = () => setFilterModalVisible(!isFilterModalVisible);
  const [isAddStockModalVisible, setAddStockModalVisible] = useState(false);
  const toggleAddStockModal = () => setAddStockModalVisible(!isAddStockModalVisible);
  const userData = useAuth();
  const { stockShares, getStocksDividendData } = useStocks();
  const correctMarginTop  = userData? 0:10;
  const logoSize = (Dimensions.get('window').width) * 0.4;

  const dividends = stockShares ? ( getStocksDividendData(stockShares)) : [];
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

const chartData = useMemo(() => {
  return filteredDividends.length > 0 ? filteredDividends : dividends;
}, [filteredDividends, dividends]);

const total = useMemo(() => {
  return chartData.reduce(
    (sum, d) => sum + d.amount * (stockShares?.[d.ticker]?.quantity || 0),
    0
  );
}, [chartData, stockShares]);

  return (
    <View style={styles.container}>
      <ScrollView scrollEnabled={!isFilterModalVisible}>
        <Image
          source={require('@/assets/images/img.png')}
          style={{width:logoSize, height:logoSize, marginTop:correctMarginTop}}
        />
        <Text style={CommonStyles.headerText}>SIGMA INVEST</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RENDIMENTOS DO PERÍODO:</Text>
          <Text style={styles.totalText}>{toBRL(total)}</Text>
          <View style={styles.containerLimpar}>
            <Pressable
            onPress={toggleFilterModal}
            style={({ pressed }) => [
              styles.buttonFiltrar,{ backgroundColor: pressed ? Colors.primaryDark : Colors.primary } ]}>
            <Text style={styles.TextFiltrar}>Filtrar</Text>
          </Pressable>
            <Pressable
            onPress={toggleAddStockModal}
            style={({ pressed }) => [
              styles.buttonFiltrar,{ backgroundColor: pressed ? Colors.primaryDark : Colors.primary } ]}>
            <Text style={styles.TextFiltrar}>Adicionar</Text>
          </Pressable>
          </View>

        </View>

       <View style={styles.section}>
  {/* Renderiza o gráfico se houver dados */}
    <DividendLineChart
      payments={chartData}
    />

  {dividends.length > 0 ? (
    (filteredDividends.length > 0 ? filteredDividends : dividends).map(
      (dividend, index) => (
        <View
          key={`${dividend.id}-${index}`}
          style={[CommonStyles.card, styles.dividendItem]}
        >
          <Text style={styles.ticker}>{dividend.ticker}</Text>
          <Text style={styles.quantity}>
            Cotas: {stockShares?.[dividend.ticker]?.quantity}
          </Text>

          <View style={styles.rendimentos}>
            <Text style={styles.label}>Rendimentos: </Text>
            <Text style={styles.value}>
              {toBRL(
                dividend.amount *
                  (stockShares?.[dividend.ticker]?.quantity || 0)
              )}
            </Text>
          </View>

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
      )
    )
  ) : (
    <Text style={styles.text}>Nenhum dividendo encontrado</Text>
  )}
</View>


        <CustomModal title="Filtrar Ativos" visible={isFilterModalVisible} onClose={toggleFilterModal}>
          <View style={styles.modal}>

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

            <View style={styles.containerLimpar}>

              <ModalButton
                onPress={()=>{setFilterModalVisible(false)}}
                title={'Fechar'}
              />
              <ModalButton
                onPress={()=>{
                  resetFilters();
                  setFilterModalVisible(false);
                }}
                title={'Limpar'}
              />
            </View>

          </View>
        </CustomModal>

        <CustomModal title={'Adicionar Ativos'} visible={isAddStockModalVisible} onClose={()=>{setAddStockModalVisible(false)}}>
          <View style={[styles.modal]}>
             <AddStockModal onClose={()=>{setAddStockModalVisible(false)}} />
          </View>

        </CustomModal>
      </ScrollView>
      <AdBanner/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.container,
    alignItems: "center",
    width:'100%',
    gap: 8,
    flex: 1,
  },
  section: {
    width: "100%",
    alignItems: 'center',
    marginBottom: 20,
    
  },
  totalText: {
    color: Colors.success,
    fontSize: 32,
    fontWeight: "500",
    marginBottom: 10
  },
  dividendItem: {
    width: "90%",
    borderLeftWidth: 4,
    borderLeftColor: Colors.textLight,
  },
  ticker: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  quantity: {
    fontSize: 16,
    color: Colors.text,
  },
  value: {
    fontSize: 16,
    color: Colors.success,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    color: Colors.text,
  },
  type: {
    fontSize: 14,
    marginTop: 10,
    fontStyle: "italic",
    color: Colors.text,
  },
  modal: {
  backgroundColor: Colors.background,
  paddingBottom: 40,
  borderRadius: 10,
  width: '90%',
  maxHeight: '50%',
  minHeight: 100, // ou o valor que funcionar melhor
  alignItems: 'stretch',
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
  rendimentos: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  sectionTitle: {
    fontSize: 23,
    marginTop: 10,
    color: Colors.text,
    fontWeight: '400',
  },
  buttonFiltrar: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 10,
  },
  TextFiltrar: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',

  },
    buttonLimpar: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 10,
    width: '50%',
    alignItems: 'center',
  },
  TextLimpar: {
    fontSize: 15,
    fontWeight: '500',
    color: 'black',

  },
  containerLimpar: {
  flexDirection:'row',
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    gap:5,
    padding:5,
  },
  text:{
    color:Colors.text
  },
});
