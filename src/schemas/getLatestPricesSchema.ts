import { z } from "zod";

export const getLatestPricesSchema = z.object({
  limit: z.number().default(100),
  traderLevels: z.object({
    prapor: z.number().min(1).max(4).default(4),
    therapist: z.number().min(1).max(4).default(4),
    fence: z.number().min(1).max(4).default(4),
    skier: z.number().min(1).max(4).default(4),
    peacekeeper: z.number().min(1).max(4).default(4),
    mechanic: z.number().min(1).max(4).default(4),
    ragman: z.number().min(1).max(4).default(4),
    jaeger: z.number().min(1).max(4).default(4),
  }),
});
