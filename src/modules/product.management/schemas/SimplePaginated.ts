import { z } from "zod";

export const SimplePaginatedSchema = <T extends z.ZodTypeAny>(item: T) =>
  z
    .object({
      current_page: z
        .union([z.number().int().nonnegative(), z.string()])
        .nullable(),
      current_page_url: z.string(),
      data: z.array(item).nullable(),
      first_page_url: z.string(),
      from: z.union([z.number().int().nonnegative(), z.string()]).nullable(),
      next_page_url: z.string().nullable(),
      path: z.string(),
      per_page: z
        .union([z.number().int().nonnegative(), z.string()])
        .nullable(),
      prev_page_url: z.string().nullable(),
      to: z.union([z.number().int().nonnegative(), z.string()]).nullable(),
    })
    .strict();
