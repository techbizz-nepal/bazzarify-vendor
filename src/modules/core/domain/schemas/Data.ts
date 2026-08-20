import { z } from "zod";

export const Data = <T extends z.ZodTypeAny>(payloadItem: T) =>
  z
    .object({
      message: z.string(),
      payload: payloadItem.nullable().optional(),
    })
    .strip();
