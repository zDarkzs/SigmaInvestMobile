import { useState, useEffect } from "react";
import { Dividend } from "@/types/dividendTypes";
import { filterDividends, updateFilter, FilterParams, Variables } from "@/scripts/dividendFiltering";

export const useDividendFilter = (dividends: Dividend[] = []) => {
  const [selectedYear, setSelectedYear] = useState("Todos");
  const [selectedMonth, setSelectedMonth] = useState("Todos");
  const [selectedTicker, setSelectedTicker] = useState("Todos");
  const [filtered, setFiltered] = useState<Dividend[]>(dividends);

  const data: FilterParams = {
    unfilteredDividends: dividends,
    selectedYear,
    selectedMonth,
    selectedTicker,
  };

  let variables: Variables = updateFilter(data);

  useEffect(() => {
    setFiltered(filterDividends(data));
  }, [selectedYear, selectedMonth, selectedTicker]);

  const resetFilters = () => {
    setSelectedYear("Todos");
    setSelectedMonth("Todos");
    setSelectedTicker("Todos");
  };

  return {
    selectedYear,
    selectedMonth,
    selectedTicker,
    setSelectedYear,
    setSelectedMonth,
    setSelectedTicker,
    filteredDividends: filtered,
    availableYears: variables.availableYears,
    availableMonths: variables.availableMonths,
    availableTickers: variables.availableTickers,
    resetFilters,
  };
};