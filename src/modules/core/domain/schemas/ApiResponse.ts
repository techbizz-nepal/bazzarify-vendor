import { z } from "zod";

export const ApiResponse = z
  .object({
    data: z.object({
      message: z.string().nullable(),
      payload: z.record(z.string(), z.any()).optional(),
    }),
    metaData: z.object({
      error: z.string().optional(),
      errorCode: z.number().optional(),
    }),
  })
  .strip();

export type TApiResponse = z.infer<typeof ApiResponse>;
