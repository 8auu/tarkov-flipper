import { z } from "zod";
import { type Price } from "~/app/types/Price";
import { updatedCachedPrices } from "~/app/utils/updateCachedPrices";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const tarkovRouter = createTRPCRouter({
  getLatestPrices: publicProcedure
    .input(
      z.object({
        limit: z.number().default(100),
        traderLevel: z.number().min(1).max(4),
      }),
    )
    .query(async ({ ctx, input }) => {
      const updatedAt = await ctx.redis.get("tarkov:prices:updatedAt");

      if (updatedAt && Date.now() - Number(updatedAt) < 1000 * 60) {
        const rawPrices = await ctx.redis.hgetall("tarkov:prices");
        const prices = Object.values(rawPrices).map(
          (price) => JSON.parse(price) as Price,
        );

        return filterPrices({
          prices: prices,
          traderLevel: input.traderLevel,
          limit: input.limit,
        });
      }

      const prices = await updatedCachedPrices();
      return filterPrices({
        prices: prices,
        traderLevel: input.traderLevel,
        limit: input.limit,
      });
    }),
});

interface Props {
  prices: Price[];
  traderLevel: number;
  limit: number;
}

const filterPrices = ({ prices, traderLevel, limit }: Props) => {
  const sortedPrices = prices
    .map((item) => {
      let offerWeight = 1;
      if (item.lastTotalOfferCount >= 1 && item.lastTotalOfferCount <= 5) {
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
    .filter((item) => item.minTraderLevel <= traderLevel)
    .slice(0, limit);

  return sortedPrices;
};
