import React from "react";
import { View, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Colors } from "@/constants/Colors";

type ChartDataPoint = {
  date: string;
  total: number;
};

interface DividendLineChartProps {
  data: ChartDataPoint[];
}

const DividendLineChart: React.FC<DividendLineChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        data: data.map((d) => d.total),
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
