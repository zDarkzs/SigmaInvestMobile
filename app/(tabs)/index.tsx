import { View,Text,Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {mockDividends} from "@/data/mockDividends";

import {useAuth} from "@/context/AuthContext";

export default function HomeScreen() {
  const total = 0.0
  const {token} = useAuth();
  const dividendData = mockDividends;



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
          console.log(dividend)
          return <View style={styles.dividendEvenItem}>
            {dividend.stock.name}
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
  dividendEvenItem:{
    flexDirection:'row',
    justifyContent:'space-around',
    backgroundColor:'#1a237e'
  },
  headerText:{
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1A237E',
  },
  graph:{
    width:'80%',
    backgroundColor:'green',
    aspectRatio:1
  },
  sectionContainer:{
    flexDirection:'column',
    alignItems:'center'
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
