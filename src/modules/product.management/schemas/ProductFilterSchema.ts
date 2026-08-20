import { z } from "zod";

export const ProductStoreFilterOptionSchema = z
  .object({
    value: z.uuid(),
    label: z.string(),
  })
  .strict();

export const ProductStoreFilterOptionPayloadSchema = z
  .object({
    options: z.array(ProductStoreFilterOptionSchema),
  })
  .strict();
