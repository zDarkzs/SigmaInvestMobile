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

export default function HomeScreen() {
  const total = 0.0
  const [isFilterModalVisible,setFilterModalVisible] = useState(false);
  const mockStockShares = generateMockStockShares();

  const [selectedYear, setSelectedYear] = useState<string>('Todos');
  const [selectedMonth, setSelectedMonth] = useState<string>('Todos');
  const [filteredDividends, setFilteredDividends] = useState<Dividend[]>([]);

  const toggleFilterModal=()=>{setFilterModalVisible(!isFilterModalVisible)}
  const dividendData = Object.values(mockStockShares).flatMap(stock =>
    stock.payments.map(payment => ({
      ...payment,
      totalAmount: payment.amount * stock.quantity
    }))
  );


  return (<ScrollView scrollEnabled={!isFilterModalVisible}>

    <View style={styles.container}>

     <View>
         <Text style={styles.headerText}>SIGMA INVEST - PI4</Text>
     </View>
     
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>DIVIDENDOS DO MÊS:</Text>
        <Button title={'"MÊS"'} onPress={toggleFilterModal}/>
        <Text style={styles.valueText}>R$ {total.toFixed(2).replace('.',',')}</Text>
      </View>
      <View style={styles.sectionContainer}>

      {dividendData?.length>0?(
        dividendData?.map((dividend, index:number)=>{
          return <View style={[styles.dividendItem,{
          backgroundColor:'#f8f8f8',
          borderWidth: 3,
          borderColor: '#1A237E',
          margin: 10,
          
        }]}>
            <Text style={[styles.dividendItemText,{color:'#1a237e'}]}>{dividend?.ticker}</Text>
            <Text style={[styles.dividendItemText,{color:'#1a237e', left: 180}]}>Cotas: </Text>
            <Text style={[styles.valueItemText,{color: '#1A237E',}]} >Rendimentos:</Text>
            <Text style={[styles.valueItemText,{color:'green'}]}>{toBRL(dividend?.amount)}</Text>
            <Text style={[styles.valueItemText,{color: '#1A237E',}]} >Daqui a x Dias:</Text>
            <Text style={[styles.details,{color: '#1A237E',}]} >Detalhes</Text>
          </View>
        })
      ):(
        <Text>PI4</Text>
      )}
      </View>
    </View>
    <CustomModal  visible={isFilterModalVisible} onClose={ toggleFilterModal}>
      <Text>Filtrado</Text>
    </CustomModal>
  </ScrollView>
  );
}

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
    fontWeight:'400',
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
