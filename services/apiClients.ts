import { ApiConfig, Dividend } from "../types/dividendTypes";

const createBrapiConfig: () => ApiConfig = () => {
  const apiKey = "7AYrqS5jDLBXnrturQkFcj";

  return {
    name: "Brapi",
    baseUrl: "https://brapi.dev/api",
    apiKey: apiKey,
    getDividendEndpoint: (ticker: string) =>
      `/quote/${ticker}?token=${apiKey}&dividends=true`,
    dividendResponseParser: (data: any): Dividend[] => {
      if (!data.results || !Array.isArray(data.results)) return [];

      let parsedDividends: Dividend[] = [];

      for (const stockData of data.results) {
        if (!stockData?.dividendsData?.cashDividends) continue;

        const ticker = stockData.symbol;
        const cashDividends = stockData.dividendsData.cashDividends;

        for (const dividend of cashDividends) {
          if (!dividend.paymentDate) continue;
          const type: () => "ordinary" | "special" | "interest" = () => {
            if (dividend.label?.includes("JCP")) return "interest";
            if (dividend.relatedTo?.includes("pecial")) return "special";
            return "ordinary";
          };
          const formatDate = (dateString: string | null) => {
            return dateString ? dateString.split("T")[0] : "undefined";
          };
          const amount = dividend.amount;
          parsedDividends.push({
            ticker: ticker,
            amount: dividend.rate,
            id: `${ticker}-${dividend.paymentDate}-${dividend.recordDate}`,
            type: type(),
            paymentDate: formatDate(dividend.paymentDate),
            recordDate: formatDate(dividend.lastDatePrior),
            declaredDate: formatDate(dividend.approvedOn),
            currency: "BRL",
            source: "brapi",
            description: `${dividend.label || ""} - ${
              dividend.relatedTo || ""
            }`.trim(),
          });
        }
      }

      return parsedDividends;
    },
  };
};

export const API_CONFIGS = {
  BRAPI: createBrapiConfig(),
};
