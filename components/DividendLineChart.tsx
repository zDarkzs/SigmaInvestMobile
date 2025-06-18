// DividendLineChart.tsx
import React from "react";
import { View, Dimensions, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Colors } from "@/constants/Colors";

type Payment = {
  paymentDate: string;
  amount: number;
};

interface DividendLineChartProps {
  payments: Payment[];
}

const DividendLineChart: React.FC<DividendLineChartProps> = ({ payments }) => {
  if (payments.length === 0) {
    return <Text style={{ textAlign: "center", marginVertical: 8 }}>Nenhum pagamento para exibir no gráfico.</Text>;
  }

  // Calcular os totais por dia
  const dailyTotals: { [date: string]: number } = {};

  payments.forEach((payment) => {
    if (dailyTotals[payment.paymentDate]) {
      dailyTotals[payment.paymentDate] += payment.amount;
    } else {
      dailyTotals[payment.paymentDate] = payment.amount;
    }
  });

  const chartData = {
    labels: Object.keys(dailyTotals).sort(),
    datasets: [
      {
        data: Object.keys(dailyTotals)
          .sort()
          .map((date) => dailyTotals[date]),
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View>
      <LineChart
        data={chartData}
        width={Dimensions.get("window").width - 32}
        height={220}
        yAxisLabel="R$"
        chartConfig={{
          backgroundGradientFrom: Colors.primaryLight,
          backgroundGradientTo: Colors.primaryDark,
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

export default DividendLineChart;
