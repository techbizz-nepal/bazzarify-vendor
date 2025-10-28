import { OrderSchema } from "@/modules/order.management/schemas/orderSchema";
import { z } from "zod";

export const OrderShowPayloadSchema = z
  .object({
    order: OrderSchema.nullable(),
  })
  .strip();

export type TOrderShowPayloadSchema = z.infer<typeof OrderShowPayloadSchema>;
