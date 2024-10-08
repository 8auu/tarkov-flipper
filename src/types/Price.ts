import { type ItemTypes } from "./ItemTypes";

export interface Price {
  id: string;
  name: string;
  trader: string;
  fleaAvg24hPrice: number;
  lastLowestPrice: number | undefined;
  profitPerItem: number;
  sellFor: number;
  updated: Date;
  totalProfit: number;
  lastTotalOfferCount: number;
  itemTypes: ItemTypes[];
  buyLimit: number;
  itemImageUrl: string;
  minTraderLevel: number;
  buyFor: number;
  historicalPrices: {
    timestamp: string;
    price: number;
  }[];
}
