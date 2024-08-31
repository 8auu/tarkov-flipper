import { z } from "zod";
import { ItemTypes } from "~/app/types/ItemTypes";
import { getFleaPrices } from "~/app/utils/getFleaPrices";
import { getTraderPrices } from "~/app/utils/getTraderPrices";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

interface Prices {
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
}

export const tarkovRouter = createTRPCRouter({
  getLatestPrices: publicProcedure
    .input(
      z.object({
        limit: z.number().default(100),
        traderLevel: z.number().min(1).max(4),
      }),
    )
    .query(async ({ input }) => {
      try {
        const traderPrices = await getTraderPrices();
        const fleaPrices = await getFleaPrices({ limit: 100000, offset: 0 });

        const items: Prices[] = [];

        for (const trader of traderPrices.traders) {
          if (!trader.cashOffers.length) continue;

          for (const offer of trader.cashOffers) {
            const item = fleaPrices.find(
              (fleaItem) => fleaItem.id === offer.item.id,
            );
            if (!item) continue;
            if (
              offer.item.types.includes(ItemTypes.gun) ||
              offer.item.types.includes(ItemTypes.preset)
            )
              continue;
            if (offer.minTraderLevel > input.traderLevel) continue;
            if (!item.avg24hPrice) continue;

            // TODO: get the price of USD/EURO from the API
            if (offer.currency === "USD") offer.price = offer.price * 145;
            if (offer.currency === "EUR") offer.price = offer.price * 161;

            const sellForFlea = item.sellFor.find(
              (sellFor) => sellFor.vendor.name === "Flea Market",
            );
            if (!sellForFlea) continue;
            const profitPerItem = sellForFlea.priceRUB - offer.price;
            items.push({
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
            });
          }
        }

        const removeDuplicates = (arr: Prices[]) => {
          const seen = new Set();
          return arr.filter((item) => {
            const duplicate = seen.has(item.name);
            seen.add(item.name);
            return !duplicate;
          });
        };

        const uniqueItems = removeDuplicates(items);

        const mostProfitable = uniqueItems
          .map((item) => {
            let offerWeight = 1;
            if (
              item.lastTotalOfferCount >= 1 &&
              item.lastTotalOfferCount <= 5
            ) {
              offerWeight = 0.01;
            } else if (
              item.lastTotalOfferCount >= 1 &&
              item.lastTotalOfferCount <= 10
            ) {
              offerWeight = 0.1;
            } else if (
              item.lastTotalOfferCount > 10 &&
              item.lastTotalOfferCount <= 50
            ) {
              offerWeight = 0.5;
            } else if (
              item.lastTotalOfferCount > 50 &&
              item.lastTotalOfferCount <= 100
            ) {
              offerWeight = 0.8;
            }

            const weightedProfit = item.maxProfit * offerWeight;

            return {
              ...item,
              weightedProfit,
            };
          })
          .sort((a, b) => b.weightedProfit - a.weightedProfit)
          .slice(0, input.limit);

        return mostProfitable;
      } catch (error) {
        console.error(error);
        return [];
      }
    }),
});
