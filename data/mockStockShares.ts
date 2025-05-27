import { StockShares, Dividend } from "@/types/dividendTypes";

export const generateMockStockShares = (): StockShares => {
  // Gerador de dividendos para uma ação específica
  const generateDividendsForStock = (ticker: string): Dividend[] => {
    const dividends: Dividend[] = [];
    const types: Array<'ordinary' | 'special' | 'interest'> = ['ordinary', 'special', 'interest'];
    const descriptions = [
      "Dividendo Mensal",
      "JCP - Juros sobre Capital",
      "Dividendo Trimestral",
      "Dividendo Anual",
      "Dividendo Especial"
    ];

    // Gera 3 a 6 dividendos por ação
    const dividendCount = Math.floor(Math.random() * 4) + 3;
    const currentDate = new Date();

    for (let i = 0; i < dividendCount; i++) {
      // Data de pagamento nos últimos 12 meses
      const paymentDate = new Date(currentDate);
      paymentDate.setMonth(paymentDate.getMonth() - Math.floor(Math.random() * 12));

      // Data de registro (15-30 dias antes do pagamento)
      const recordDate = new Date(paymentDate);
      recordDate.setDate(recordDate.getDate() - (Math.floor(Math.random() * 15) + 15));

      // Data de declaração (15-30 dias antes do registro)
      const declaredDate = new Date(recordDate);
      declaredDate.setDate(declaredDate.getDate() - (Math.floor(Math.random() * 15) + 15));

      dividends.push({
        id: `${ticker}-${paymentDate.toISOString().split('T')[0]}-${i}`,
        ticker,
        amount: parseFloat((Math.random() * 5 + 0.1).toFixed(2)), // R$0.10 a R$5.00
        paymentDate: paymentDate.toISOString().split('T')[0],
        recordDate: recordDate.toISOString().split('T')[0],
        declaredDate: declaredDate.toISOString().split('T')[0],
        type: types[Math.floor(Math.random() * types.length)],
        currency: 'BRL',
        source: ['Brapi', 'Yahoo Finance', 'Alpha Vantage'][Math.floor(Math.random() * 3)],
        description: descriptions[Math.floor(Math.random() * descriptions.length)]
      });
    }

    return dividends.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  };

  // Ações brasileiras populares
  const tickers = ['PETR4', 'VALE3', 'ITUB4', 'BBAS3', 'BBDC4', 'WEGE3', 'ABEV3'];
  const stockShares: StockShares = {};

  tickers.forEach(ticker => {
    stockShares[ticker] = {
      quantity: Math.floor(Math.random() * 500) + 10, // 10-510 cotas
      payments: generateDividendsForStock(ticker)
    };
  });

  return stockShares;
};

// Exemplo de uso:
// const mockStockShares = generateMockStockShares();
// console.log(mockStockShares);