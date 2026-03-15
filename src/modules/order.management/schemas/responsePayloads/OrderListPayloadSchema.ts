import { SimplePaginatedSchema } from "@/modules/core/schemas/SimplePaginated";
import { ServerDataTableMetaSchema } from "@/modules/core/domain/schemas/ServerDataTableMeta";
import { OrderListItemSchema } from "@/modules/order.management/schemas/orderSchema";
import { z } from "zod";

export const OrderListPayloadSchema = z
  .object({
    orders: SimplePaginatedSchema(OrderListItemSchema).nullable(),
    table: ServerDataTableMetaSchema,
  })
  .strip();

export type TOrderListPayloadSchema = z.infer<typeof OrderListPayloadSchema>;
