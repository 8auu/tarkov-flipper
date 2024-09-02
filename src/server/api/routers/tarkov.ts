import { type z } from "zod";
import { getLatestPricesSchema } from "~/schemas/getLatestPricesSchema";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type Price } from "~/types/Price";

export const tarkovRouter = createTRPCRouter({
  getLatestPrices: publicProcedure
    .input(getLatestPricesSchema)
    .query(async ({ ctx, input }) => {
      const rawPrices = await ctx.redis.hgetall("tarkov:prices");
      const prices = Object.values(rawPrices).map(
        (price) => JSON.parse(price) as Price,
      );

      return filterPrices({
        prices: prices,
        input,
      });
    }),
});

interface Props {
  prices: Price[];
  input: z.infer<typeof getLatestPricesSchema>;
}

const filterPrices = ({ prices, input }: Props) => {
  const sortedPrices = prices
    .filter((item) => {
      if (input.minimumLastOfferCount !== undefined) {
        return item.lastTotalOfferCount >= input.minimumLastOfferCount;
      }
      return true;
    })
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
      const weightedProfit = item.totalProfit * offerWeight;
      return {
        ...item,
        weightedProfit,
      };
    })
    .sort((a, b) => {
      if (input.smartFilter) {
        return b.weightedProfit - a.weightedProfit;
      }
      return b.totalProfit - a.totalProfit;
    })
    .filter((item) => {
      return (
        item.minTraderLevel <=
        input.traderLevels[
          item.trader.toLowerCase() as keyof typeof input.traderLevels
        ]
      );
    })
    .slice(0, input.limit);

  return sortedPrices;
};
