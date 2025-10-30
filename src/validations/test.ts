import { z } from "zod";

export const testformSchema = z.object({
  id: z.number(),
  name: z.string(),
  short_description: z.string(),
  category: z.string().optional(),
  avg_cost: z.string(),
  cost: z.preprocess((val) => Number(val) || 0, z.number()),
  laboratory: z.array(z.string()).optional(),
});
