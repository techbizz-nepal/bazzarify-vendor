import StoreSchema from "@/modules/vendor/domain/schemas/store";
import { z } from "zod";

export const StoreCreatePayloadSchema = z
  .object({
    store: StoreSchema,
  })
  .strip();

export default StoreCreatePayloadSchema;

export type TStoreCreatePayloadSchema = z.infer<
  typeof StoreCreatePayloadSchema
>;
