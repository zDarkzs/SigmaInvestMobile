import {Dimensions} from "react-native";
import {LineChart} from "react-native-chart-kit";
import React from "react";
import {Dividend} from "@/types/dividendTypes";

export default function DividendLineChart({dividends}:any) {
    console.log(dividends)
    const paymentDates = dividends.map((dividend:Dividend)=> dividend.paymentDate)
    console.log(paymentDates)
    const paymentAmounts = dividends.map((dividend:Dividend)=> dividend.amount)
    console.log(paymentAmounts)


    const data = {
        labels: paymentDates,
        datasets: [
        {
            data: paymentAmounts,
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
            strokeWidth: 2 // optional
        }
    ],
    legend: ["Rainy Days"] // optional
    };

    return (

    <LineChart
        data={data}
        width={Dimensions.get('window').width}
        height={220}
        chartConfig={{
        backgroundColor: "#808080",
        backgroundGradientFrom: "#686868",
        backgroundGradientTo: "#686868",
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#26c5ff"
        }
        }}
        />
        )
}
