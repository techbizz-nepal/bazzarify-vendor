import { z } from "zod";

export const MetaDataSchema = z
  .object({
    error: z
      .union([z.string(), z.record(z.string(), z.unknown())])
      .nullable(),
    executionTime: z.number().nullable().optional(),
    errorCode: z.number().nullable(),
  })
  .strip();
