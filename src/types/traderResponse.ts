import { type Currencies } from "./Currencies";
import { type Item } from "./Item";

// Define the types for cash offers
type CashOffer = {
  item: Item;
  price: number;
  minTraderLevel: number;
  currency: Currencies;
  buyLimit: number;
};

type BarterItem = {
  item: Item;
  count: number;
};

type Barter = {
  requiredItems: BarterItem[];
};

type Trader = {
  name: string;
  cashOffers: CashOffer[];
  barters: Barter[];
};

export type TradersResponse = {
  traders: Trader[];
};
