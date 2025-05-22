import {Dimensions} from "react-native";
import {LineChart} from "react-native-chart-kit";
import React from "react";
import {Dividend,StockShares} from "@/types/dividendTypes";
import {formatDate} from "tough-cookie";

export default function DividendLineChart({dividends}:any) {
    const [shares,setShares] = React.useState<StockShares>({});

    const processChartData = ()=>{
        const groupedByDate: {[date:string]:number} = {}

        dividends.forEach(dividend => {
            const sharedCount = shares[dividend.ticker]||0;
            const totalAmount = dividend.amount * sharedCount;

            if(totalAmount>0){
                if(!groupedByDate[dividend.paymentDate]){
                    groupedByDate[dividend.paymentDate]=0;
                }
                groupedByDate[dividend.paymentDate]+=totalAmount;
            }
        });
        const  sortedDates = Object.keys(groupedByDate).sort((a,b)=>
        new Date(a).getTime()-new Date(b).getTime()
        );
        //const total = (groupedByDate? (Object.values(groupedByDate).reduce((a,b)=> a+b)):([]))
        return {
            labels: sortedDates.map(date=> formatDateForChart(date)),
            amounts: sortedDates.map(date=> groupedByDate[date]),
           // total: total
        }

    }
    const formatDateForChart = (dateString:string) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth()}+1`;
    }
    const chartData = processChartData()
    const data = {
        labels: chartData.labels,
        datasets: [
        {
            data: chartData.amounts,
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
            strokeWidth: 2 // optional
        }
    ],
    legend: ["Ultimos pagamentos"] // optional
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
