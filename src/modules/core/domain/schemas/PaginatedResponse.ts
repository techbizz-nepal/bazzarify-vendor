import { z } from "zod";

export const PaginatedResponse = <T extends z.ZodTypeAny>(payloadItem: T) =>
  z
    .object({
      current_page: z.number(),
      first_page_url: z.string(),
      from: z.number(),
      data: z.array(payloadItem),
      next_page_url: z.string().nullable(),
      path: z.string().nullable(),
      per_page: z.number(),
      prev_page_url: z.string().nullable(),
      to: z.number(),
    })
    .strip();

export type TPaginatedResponse<T extends z.ZodTypeAny> = z.infer<
  ReturnType<typeof PaginatedResponse<T>>
>;
