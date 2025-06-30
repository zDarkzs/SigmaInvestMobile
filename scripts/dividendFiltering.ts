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
export function getAvailableMonths(params:FilterParams){
    let year = params.selectedYear;
    if (year ==="Todos") return [];
    const filtered = params.unfilteredDividends.filter((d) => d.paymentDate.startsWith(`${year}-`));
    return [
      "Todos",
      ...Array.from(
        new Set(filtered.map((d) => d.paymentDate.split("-")[1]))
      ).sort((a, b) => parseInt(a) - parseInt(b)),
    ];
}

export function updateFilter(params:FilterParams):Variables {
    let dividends = params.unfilteredDividends;

    return  {
        availableTickers:["Todos",...Array.from(new Set(dividends.map((d) => d.ticker))).sort(),],
        availableYears:["Todos",...Array.from(new Set(dividends.map((d) => d.paymentDate.split("-")[0]))),].sort((a, b) => b.localeCompare(a)),
        availableMonths:getAvailableMonths(params),
    }

}

export function filterDividends(params:FilterParams): Dividend[]{
    let dividends: Dividend[] = params.unfilteredDividends;

    if (params.selectedYear !== "Todos") {
      dividends = dividends.filter((d) =>
        d.paymentDate.startsWith(`${params.selectedYear}-`)
      );
    }

    if (params.selectedMonth !== "Todos") {
      dividends = dividends.filter(
        (d) => d.paymentDate.split("-")[1] === params.selectedMonth
      );
    }
    if (params.selectedTicker !== "Todos") {
      dividends = dividends.filter((d) => d.ticker === params.selectedTicker);
    }
    return dividends;
}