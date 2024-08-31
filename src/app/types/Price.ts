import { type ItemTypes } from "./ItemTypes";

export interface Price {
  id: string;
  name: string;
  trader: string;
  fleaAvg24hPrice: number;
  lastLowestPrice: number | undefined;
  profitPerItem: number;
  sellFor: number;
  maxProfit: number;
  lastTotalOfferCount: number;
  itemTypes: ItemTypes[];
  buyLimit: number;
  itemImageUrl: string;
  minTraderLevel: number;
  buyFor: number;
}
