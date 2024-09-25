import { redis } from "~/app/redis";
import { db } from "~/server/db";
import { ItemTypes } from "../types/ItemTypes";
import { type Price } from "../types/Price";
import { getFleaPrices } from "./getFleaPrices";
import { getTraderPrices } from "./getTraderPrices";

export const updatedCachedPrices = async () => {
  const traderPricesPromise = getTraderPrices();
  const fleaPricesPromise = getFleaPrices({ limit: 100000, offset: 0 });
  const fetchStoredItemsPromise = db.item.findMany();

  const [traderPrices, fleaPrices, storedItems] = await Promise.all([
    traderPricesPromise,
    fleaPricesPromise,
    fetchStoredItemsPromise,
  ]);

  const newItems = fleaPrices.filter(
    (fleaItem) => !storedItems.find((item) => item.id === fleaItem.id),
  );

  await db.item.createMany({
    data: newItems.map((item) => ({
      id: item.id,
      name: item.name,
      types: item.types,
      inspectImageLink: item.inspectImageLink,
    })),
  });

  const historic = fleaPrices.map((fleaPrice) => ({
    timestamp: new Date(fleaPrice.updated), // Ensure this is a Date object
    lastLowPrice: fleaPrice.lastLowPrice,
    avg24hPrice: fleaPrice.avg24hPrice,
    lastOfferCount: fleaPrice.lastOfferCount,
    price: fleaPrice.basePrice,
    itemId: fleaPrice.id,
  }));

  await db.historicalStats.createMany({
    data: historic,
    skipDuplicates: true,
  });

  const traderFlipPrices: Price[] = [];

  for (const trader of traderPrices.traders) {
    if (!traderPrices) return;
    if (!trader.cashOffers.length) continue;
    for (const offer of trader.cashOffers) {
      const item = fleaPrices.find((fleaItem) => fleaItem.id === offer.item.id);
      if (!item) continue;
      if (!item.avg24hPrice) continue;
      if (
        offer.item.types.includes(ItemTypes.GUN) ||
        offer.item.types.includes(ItemTypes.PRESET)
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
      traderFlipPrices.push({
        id: item.id,
        name: item.name,
        trader: trader.name,
        updated: new Date(item.updated),
        fleaAvg24hPrice: item.avg24hPrice,
        lastLowestPrice: item.lastLowPrice,
        profitPerItem: profitPerItem,
        sellFor: sellForFlea.priceRUB,
        totalProfit: profitPerItem * offer.buyLimit,
        lastTotalOfferCount: item.lastOfferCount,
        itemTypes: item.types,
        itemImageUrl: item.inspectImageLink,
        buyLimit: offer.buyLimit,
        minTraderLevel: offer.minTraderLevel,
        buyFor: offer.price,
        historicalPrices: item.historicalPrices,
      });
    }
  }

  const seen = new Set();
  const filteredPrices = traderFlipPrices.filter((item) => {
    const duplicate = seen.has(item.name);
    seen.add(item.name);
    return !duplicate;
  });

  await redis.del("tarkov:prices");

  const pipeline = redis.pipeline();

  for (const price of filteredPrices) {
    pipeline.hset("tarkov:prices", price.id, JSON.stringify(price));
  }

  await pipeline.exec();
  await redis.set("tarkov:prices:updatedAt", Date.now());

  return filteredPrices;
};
