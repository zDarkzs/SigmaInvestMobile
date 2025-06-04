import {View, Text, Image, StyleSheet, Platform, ScrollView, Button} from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {generateMockStockShares} from "@/data/mockStockShares";

import {useAuth} from "@/context/AuthContext";
import {useDividends} from "@/hooks/useDividends";
import {Dividend} from "@/types/dividendTypes";
import {toBRL} from "@/scripts/utils";
import {useState} from "react";
import CustomModal from "@/components/CustomModal";
import {useStocks} from "@/context/StockContext";

import { Picker } from '@react-native-picker/picker';

// ... (outros imports permanecem iguais)

export default function HomeScreen() {
  const total = 0.0;
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const mockStockShares = generateMockStockShares();
  const { stockShares, getStocksDividendData } = useStocks();
  const [selectedYear, setSelectedYear] = useState<string>('Todos');
  const [selectedMonth, setSelectedMonth] = useState<string>('Todos');
  const [filteredDividends, setFilteredDividends] = useState<Dividend[]>([]);

  const toggleFilterModal = ()=> {setFilterModalVisible(!isFilterModalVisible)}

  const getAvailableYears = (dividends: Dividend[]) => {
  const years = new Set<string>();
  dividends.forEach(d => {
    const year = d.paymentDate.split('-')[0]; // Extrai o ano (parte antes do primeiro '-')
    years.add(year);
  });
  return ['Todos', ...Array.from(years)].sort((a, b) => b.localeCompare(a));
};

// Função para extrair meses disponíveis
const getAvailableMonths = (dividends: Dividend[]) => {
  const months = new Set<string>();
  dividends.forEach(d => {
    const month = d.paymentDate.split('-')[1]; // Extrai o mês (parte entre os '-')
    months.add(month);
  });
  return ['Todos', ...Array.from(months)].sort((a, b) => {
    // Ordena numericamente (01, 02, ..., 12)
    return parseInt(a) - parseInt(b);
  });
};

const getFilteredDividends = () => {
  let dividends = getStocksDividendData(stockShares || mockStockShares);

  if (selectedYear !== 'Todos') {
    dividends = dividends.filter(d =>
      d.paymentDate.startsWith(`${selectedYear}-`)
    );
  }

  if (selectedMonth !== 'Todos') {
    dividends = dividends.filter(d => {
      // Formato esperado: "2024-09-19"
      const month = d.paymentDate.split('-')[1];
      return month === selectedMonth;
    });
  }

  return dividends;
};

  const availableYears = getAvailableYears(getStocksDividendData(stockShares || mockStockShares));
  const availableMonths = getAvailableMonths(getStocksDividendData(stockShares || mockStockShares));

  // Aplica os filtros
  const applyFilters = () => {
    let dividends = getStocksDividendData(stockShares || mockStockShares);

    if (selectedYear !== 'Todos') {
      dividends = dividends.filter(d =>
        new Date(d.paymentDate).getFullYear().toString() === selectedYear
      );
    }

    if (selectedMonth !== 'Todos') {
      const monthIndex = availableMonths.indexOf(selectedMonth) - 1;
      dividends = dividends.filter(d =>
        new Date(d.paymentDate).getMonth() === monthIndex
      );
    }

    setFilteredDividends(dividends);
    toggleFilterModal();
    console.log("dividends")
    console.log(dividends)
  };

  // Reseta os filtros
  const resetFilters = () => {
    setSelectedYear('Todos');
    setSelectedMonth('Todos');
    setFilteredDividends(getStocksDividendData(stockShares || mockStockShares));
    toggleFilterModal();
  };

  // Obtém os dividendos a serem exibidos (filtrados ou não)
  const displayDividends = filteredDividends.length > 0 ? filteredDividends :
    getStocksDividendData(stockShares || mockStockShares);

  return (
    <ScrollView scrollEnabled={!isFilterModalVisible}>
      <View style={styles.container}>
        <View>
          <Text style={styles.headerText}>SIGMA INVEST</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>DIVIDENDOS DO MÊS:</Text>
          <Button
            title={`${selectedMonth === 'Todos' ? 'Todos os meses' : selectedMonth} ${selectedYear === 'Todos' ? '' : selectedYear}`}
            onPress={toggleFilterModal}
            color="#1A237E"
          />
          <Text style={styles.valueText}>R$ {total.toFixed(2).replace('.',',')}</Text>
        </View>

        <View style={styles.sectionContainer}>
          {displayDividends?.length > 0 ? (
            displayDividends.map((dividend, index) => (
              <View key={dividend.id + dividend.amount} style={[styles.dividendItem, {
                backgroundColor: '#f8f8f8',
                borderWidth: 3,
                borderColor: '#1A237E',
                margin: 10,
              }]}>
                <Text style={[styles.dividendItemText, {color: '#1a237e'}]}>
                  {dividend?.ticker}
                </Text>
                <Text style={[styles.dividendItemText, {color: '#1a237e', left: 180}]}>
                  Cotas: {stockShares?.[dividend.ticker]?.quantity || mockStockShares[dividend.ticker]?.quantity}
                </Text>
                <Text style={[styles.valueItemText, {color: '#1A237E'}]}>
                  Rendimentos:
                </Text>
                <Text style={[styles.valueItemText, {color: 'green'}]}>
                  {toBRL(dividend.amount * (stockShares?.[dividend.ticker]?.quantity || mockStockShares[dividend.ticker]?.quantity || 0))}
                </Text>
                <Text style={[styles.valueItemText, {color: '#1A237E'}]}>
                  Data: {new Date(dividend.paymentDate).toLocaleDateString('pt-BR')}
                </Text>
                <Text style={[styles.details, {color: '#1A237E'}]}>
                  {dividend.type === 'ordinary' ? 'Dividendo' :
                   dividend.type === 'special' ? 'Dividendo Especial' : 'JCP'}
                </Text>
              </View>
            ))
          ) : (
            <Text>Nenhum dividendo encontrado</Text>
          )}
        </View>
      </View>

      {/* Modal de Filtro */}
      <CustomModal visible={isFilterModalVisible} onClose={toggleFilterModal}>
        <View style={modalStyles.container}>
          <Text style={modalStyles.title}>Filtrar Dividendos</Text>

          <View style={modalStyles.filterGroup}>
            <Text style={modalStyles.label}>Ano:</Text>
            <View style={modalStyles.pickerContainer}>
              <Picker
              selectedValue={selectedYear}
              onValueChange={setSelectedYear}>
              {availableYears.map(year => (
              <Picker.Item key={year} label={year} value={year} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={modalStyles.filterGroup}>
            <Text style={modalStyles.label}>Mês:</Text>
            <View style={modalStyles.pickerContainer}>
              <Picker
              selectedValue={selectedMonth}
              onValueChange={setSelectedMonth}>
               {availableMonths.map(month => (
               <Picker.Item
              key={month}
              label={month === 'Todos' ? 'Todos' : `${month}/2024`}
              value={month}
               />
                ))}
          </Picker>
            </View>
          </View>

          <View style={modalStyles.buttonGroup}>
            <Button
              title="Aplicar Filtros"
              onPress={applyFilters}
              color="#1A237E"
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

// Estilos para o modal
const modalStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  buttonGroup: {
    marginTop: 10,
  },
});

// ... (seus estilos existentes permanecem iguais)
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    borderTopColor:'#1A237E',
    borderTopWidth:5,
    borderStyle:"solid"
  },
  header:{

  },
  dividendItem: {
  width: '100%',
  height: 180,
  borderRadius: 30,
  position: 'relative',
  backgroundColor: '#1a237e',
  paddingTop: 25,
  paddingBottom: 20,
  justifyContent: 'center',
  alignItems: 'center',
},

  dividendItemText:{
    fontSize:16,
    fontWeight:'500',
    position: 'absolute',
    top: -9,
    left: 7,
    padding: 9,

  },
  valueItemText:{
    fontSize:20,
    fontWeight:'500',
    position: 'static',
  },
  details:{
    fontSize:20,
    fontWeight:'500',
    position: 'relative',
    top: 30,
  },

  headerText:{
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1A237E',
    borderBottomWidth:1,
    marginTop: 20
  },
  graph:{
    width:'80%',
    backgroundColor:'green',
    aspectRatio:1.75,
    maxHeight:400
  },
  sectionContainer:{
    flexDirection:'column',
    alignItems:'center',
    width:'70%',
  },
  valueText:{
    color:'green',
    fontWeight:'200',
    fontSize:32,
    margin: 20,

  },
  sectionTitle:{
    fontSize: 20,
    color: '#1A237E',
    borderBottomColor: '#1A237E',
    margin: 20,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 300,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
