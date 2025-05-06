import { Stock } from '@/types/stock';
import {Dividend} from "@/types/dividend";

export const mockDividends: Dividend[] = [
  {
    stock: { symbol: "PETR4", name: "Petróleo Brasileiro S.A." },
    payout: 2.15,
    yield: 6.8,
    paydate: new Date("2025-05-20")
  },
  {
    stock: { symbol: "VALE3", name: "Vale S.A." },
    payout: 3.42,
    yield: 8.1,
    paydate: new Date("2025-06-05")
  },
  {
    stock: { symbol: "ITUB4", name: "Itaú Unibanco" },
    payout: 0.28,
    yield: 4.3,
    paydate: new Date("2025-05-15")
  },
  {
    stock: { symbol: "BBAS3", name: "Banco do Brasil" },
    payout: 1.75,
    yield: 7.2,
    paydate: new Date("2025-06-10")
  },
  {
    stock: { symbol: "BBDC4", name: "Bradesco" },
    payout: 0.32,
    yield: 3.9,
    paydate: new Date("2025-05-25")
  },
  {
    stock: { symbol: "WEGE3", name: "WEG S.A." },
    payout: 0.45,
    yield: 2.8,
    paydate: new Date("2025-06-15")
  },
  {
    stock: { symbol: "ABEV3", name: "Ambev" },
    payout: 0.18,
    yield: 3.2,
    paydate: new Date("2025-05-30")
  }
];