import { View,Text,Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {mockDividends} from "@/data/mockDividends";

import {useAuth} from "@/context/AuthContext";
import {useDividends} from "@/hooks/useDividends";

export default function HomeScreen() {
  const total = 0.0
  const {token} = useAuth();
  const dividendData = mockDividends;

  const {dividends, loading, error} = useDividends();


  return (
    <View style={styles.container}>
     <View>
         <Text style={styles.headerText}>Dashboard</Text>
     </View>
      <View style={styles.graph}>
        grafico
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Dividendos do mês</Text>
        <Text style={styles.valueText}>R$ {total.toFixed(2).replace('.',',')}</Text>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Ativos</Text>
      {dividendData?.length>0?(
        dividendData?.map((dividend:any, index:number)=>{
          const isEvenItem = (index % 2 === 0)
          console.log(dividend)
          return <View style={[styles.dividendItem,{
          backgroundColor: isEvenItem ? '#f8f8f8' : '#1a237e',
          borderBottomWidth: 1,
          borderBottomColor: '#ddd'
        }]}>
            <Text style={[styles.dividendItemText,{
              color: isEvenItem ? '#1a237e' : '#f8f8f8'
            }]}>
              {dividend.stock.name}
            </Text>
          </View>
        })
      ):(
        <Text>;-;</Text>
      )}
      </View>
    </View>
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
  dividendItem:{
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    backgroundColor:'#1a237e',
    width:'100%',
    height:'25%'
  },
  dividendItemText:{
    fontSize:16,
    fontWeight:'bold'
  },

  headerText:{
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1A237E',
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
    width:'100%',
  },
  valueText:{
    color:'green',
    fontWeight:'bold',
    fontSize:32
  },
  sectionTitle:{
    fontSize: 32,
    color: '#1A237E',
    borderBottomWidth:3,
    borderBottomColor: '#1A237E',
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
