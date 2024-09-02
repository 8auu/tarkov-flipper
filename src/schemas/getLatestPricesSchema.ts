import { z } from "zod";
import { ItemTypes } from "~/types/ItemTypes";

export const getLatestPricesSchema = z.object({
  smartFilter: z.boolean().default(true),
  limit: z.number().default(100),
  itemTypes: z.array(z.nativeEnum(ItemTypes)),
  minimumLastOfferCount: z.number().default(5),
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
