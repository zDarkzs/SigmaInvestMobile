// DividendLineChart.tsx
import React from "react";
import { View, Dimensions, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useAppColors } from "@/constants/Colors";

type Payment = {
  paymentDate: string;
  amount: number;
};

interface DividendLineChartProps {
  payments: Payment[];
}

const DividendLineChart: React.FC<DividendLineChartProps> = ({ payments }) => {
  const Colors = useAppColors();

  if (payments.length === 0) {
    return <Text style={{ textAlign: "center", marginVertical: 30, color: Colors.text }}>Nenhum pagamento para exibir no gráfico 📊.</Text>;
  }

  const dailyTotals: { [date: string]: number } = {};

  payments.forEach((payment) => {
    if (dailyTotals[payment.paymentDate]) {
      dailyTotals[payment.paymentDate] += (payment.amount);
    } else {
      dailyTotals[payment.paymentDate] = payment.amount;
    }
  });

const MAX_LABELS = 5;

const sortedDates = Object.keys(dailyTotals).sort();
const step = Math.ceil(sortedDates.length / MAX_LABELS);

const chartData = {
  labels: sortedDates.map((date, index) => {
    return index % step === 0 ? date : "";
  }),
  datasets: [
    {
      data: sortedDates.map((date) => dailyTotals[date]),
      strokeWidth: 2,
    },
  ],
};

  console.log(chartData);

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
          marginVertical: 20,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

export default DividendLineChart;
