import { redis } from "../redis";
import { ItemTypes } from "../types/ItemTypes";
import { type Price } from "../types/Price";
import { getFleaPrices } from "./getFleaPrices";
import { getTraderPrices } from "./getTraderPrices";

export const updatedCachedPrices = async () => {
  console.log(5);
  const traderPricesPromise = getTraderPrices();
  const fleaPricesPromise = getFleaPrices({ limit: 100000, offset: 0 });
  console.log(6);

  const [traderPrices, fleaPrices] = await Promise.all([
    traderPricesPromise,
    fleaPricesPromise,
  ]);
  console.log(7);

  const prices: Price[] = [];

  console.log(8);
  for (const trader of traderPrices.traders) {
    if (!trader.cashOffers.length) continue;
    for (const offer of trader.cashOffers) {
      const item = fleaPrices.find((fleaItem) => fleaItem.id === offer.item.id);
      if (!item) continue;
      if (!item.avg24hPrice) continue;
      if (
        offer.item.types.includes(ItemTypes.gun) ||
        offer.item.types.includes(ItemTypes.preset)
      )
        continue;

      // TODO: get the price of USD/EURO from the API
      if (offer.currency === "USD") offer.price = offer.price * 145;
      if (offer.currency === "EUR") offer.price = offer.price * 161;
      const sellForFlea = item.sellFor.find(
        (sellFor) => sellFor.vendor.name === "Flea Market",
      );
      if (!sellForFlea) continue;
      const profitPerItem = sellForFlea.priceRUB - offer.price;
      prices.push({
        id: item.id,
        name: item.name,
        trader: trader.name,
        fleaAvg24hPrice: item.avg24hPrice,
        lastLowestPrice: item.lastLowPrice,
        profitPerItem: profitPerItem,
        sellFor: sellForFlea.priceRUB,
        maxProfit: profitPerItem * offer.buyLimit,
        lastTotalOfferCount: item.lastOfferCount,
        itemTypes: item.types,
        itemImageUrl: item.inspectImageLink,
        buyLimit: offer.buyLimit,
        minTraderLevel: offer.minTraderLevel,
        buyFor: offer.price,
      });
    }
  }
  console.log(9);
  const removeDuplicates = (arr: Price[]) => {
    const seen = new Set();
    return arr.filter((item) => {
      const duplicate = seen.has(item.name);
      seen.add(item.name);
      return !duplicate;
    });
  };

  const filteredPrices = removeDuplicates(prices);

  console.log(10);
  await redis.del("tarkov:prices");

  console.log(11);
  for (const price of filteredPrices) {
    await redis.hset("tarkov:prices", price.id, JSON.stringify(price));
  }
  console.log(12);

  await redis.set("tarkov:prices:updatedAt", Date.now());
  console.log(13);

  return filteredPrices;
};
