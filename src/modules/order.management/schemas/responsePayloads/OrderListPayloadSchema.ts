import { SimplePaginatedSchema } from "@/modules/core/schemas/SimplePaginated";
import { OrderListSchema } from "@/modules/order.management/schemas/orderSchema";
import { z } from "zod";

export const OrderListPayloadSchema = z
  .object({
    orders: SimplePaginatedSchema(OrderListSchema).nullable(),
  })
  .strip();

export type TOrderListPayloadSchema = z.infer<typeof OrderListPayloadSchema>;
