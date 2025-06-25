import {Dividend} from "@/types/dividendTypes";
import {Variable} from "eslint-scope";

export type FilterParams = {
    unfilteredDividends: Dividend[],
    selectedYear:   string | "Todos",
    selectedMonth:  string | "Todos",
    selectedTicker: string | "Todos",
}
export type Variables ={
    availableTickers: string[];
    availableYears: string[];
    availableMonths: string[];
}
export function InitializeFilter(params:FilterParams):Variables {
    let dividends = params.unfilteredDividends;
    const getAvailableMonths = ():string[] => {
    let year = params.selectedYear;
    if (year ==="Todos") return [];
    const filtered = dividends.filter((d) => d.paymentDate.startsWith(`${year}-`));
    return [
      "Todos",
      ...Array.from(
        new Set(filtered.map((d) => d.paymentDate.split("-")[1]))
      ).sort((a, b) => parseInt(a) - parseInt(b)),
    ];
  };
    return  {
        availableTickers:["Todos",...Array.from(new Set(dividends.map((d) => d.ticker))).sort(),],
        availableYears:["Todos",...Array.from(new Set(dividends.map((d) => d.paymentDate.split("-")[0]))),].sort((a, b) => b.localeCompare(a)),
        availableMonths:getAvailableMonths()
    }

}

export function filterDividends(params:FilterParams, variables:Variables): Dividend[]{
    let filteredDividends: Dividend[] = params.unfilteredDividends;


    return filteredDividends;
}