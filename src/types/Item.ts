import { type Currencies } from "./Currencies";
import { type ItemTypes } from "./ItemTypes";

export type Item = {
  id: string;
  name: string;
  basePrice?: number; // basePrice might be undefined if not available
  lastLowPrice?: number; // lastLowPrice might be undefined if not available
  avg24hPrice?: number; // avg24hPrice might be undefined if not available
  lastOfferCount: number;
  types: ItemTypes[];
  updated: string;
  inspectImageLink: string;
  historicalPrices: {
    timestamp: string;
    price: number;
  }[];
  sellFor: {
    currency: Currencies;
    priceRUB: number;
    vendor: {
      name: string;
    };
  }[];
};
