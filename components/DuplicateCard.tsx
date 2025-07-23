import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dividend } from '../types/dividendTypes';
import { Colors } from "@/constants/Colors";

const DuplicateCard = ({ dividend }: { dividend: Dividend }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.ticker}>{dividend.ticker}</Text>
        <Text style={styles.amount}>R$ {dividend.amount.toFixed(2)}</Text>
      </View>

      <View style={styles.dates}>
        <Text>Pagamento: {dividend.paymentDate}</Text>
        {dividend.recordDate && <Text>Data ex: {dividend.recordDate}</Text>}
      </View>

      <Text style={styles.source}>Fonte: {dividend.source}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ticker: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A237E'
  },
  amount: {
    fontSize: 18,
    color: 'green',
  },
  dates: {
    marginBottom: 8,
  },
  source: {
    fontSize: 12,
    color: Colors.primary,
    textAlign: 'right',
  },
});

export default DuplicateCard;