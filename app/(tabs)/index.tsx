import { View,Text,Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import {useAuth} from "@/context/AuthContext";

export default function HomeScreen() {
    const total = 0.0
    const {token} = useAuth();

  return (
    <View style={styles.container}>
     <Text style={styles.title}>Dashboard</Text>
      <View>
        grafico
      </View>
      <Text style={styles.sectionTitle}>Dividendos do mês</Text>
      <Text style={styles.sectionTitle}>R$ {total.toFixed(2).replace('.',',')}</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  title:{
      fontSize: 48,
    fontWeight: 'bold',
    color: '#1A237E',
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
