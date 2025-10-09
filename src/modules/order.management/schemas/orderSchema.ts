import { VariantSchema } from "@/modules/product.management/schemas/VariantSchema";
import { z } from "zod";

export const OrderItemSchema = z
  .object({
    line_id: z.string().optional(),
    uuid: z.uuid(),
    order_uuid: z.uuid(),
    orderable_uuid: z.uuid(),
    orderable_type: z.string(),
    sku: z.string(),
    name: z.string(),
    variant_attrs: VariantSchema.pick({
      uuid: true,
      name: true,
      sku: true,
    })
      .strict()
      .nullable(),
    qty_ordered: z.number().int().nonnegative(),
    qty_canceled: z.number().int().nonnegative().default(0),
    qty_shipped: z.number().int().nonnegative().default(0),
    qty_refunded: z.number().int().nonnegative().default(0),

    unit_price: z.float64().nonnegative(),
    row_discount: z.float64().nonnegative().default(0),
    row_tax: z.float64().nonnegative().default(0),
    row_shipping: z.float64().nonnegative().default(0),
    row_total: z.float64().nonnegative().nonoptional(),

    meta: z.record(z.any(), z.string()).nullable(), // JSON column
    created_at: z.iso.datetime().optional(),
    updated_at: z.iso.datetime().optional(),
    deleted_at: z.iso.datetime().nullable().optional(),
  })
  .strict();
export const OrderSchema = z
  .object({
    uuid: z.uuid(),
    buyer_uuid: z.uuid(),
    buyer_type: z.string(),
    order_number: z.string(),
    status: z.string().max(32),
    items_count: z.number().int().nonnegative().default(0),
    items_quantity: z.number().int().nonnegative().default(0),
    sub_total: z.float64().nonnegative().default(0),
    discount_total: z.float64().nonnegative().default(0),
    tax_total: z.float64().nonnegative().default(0),
    shipping_total: z.float64().nonnegative().default(0),
    grand_total: z.float64().nonnegative().default(0),
    payment_status: z.string().max(32),
    payment_fee: z.float64().nonnegative().default(0),
    placed_at: z.iso.datetime(),
    cancelled_at: z.iso.datetime().nullable().optional(),
    completed_at: z.iso.datetime().nullable().optional(),
    created_at: z.iso.datetime().optional().optional(),
    updated_at: z.iso.datetime().optional().optional(),
    deleted_at: z.iso.datetime().nullable().optional(),
  })
  .extend({
    items: z.array(OrderItemSchema),
  })
  .strict();
export const CartItem = OrderItemSchema.pick({
  line_id: true,
  uuid: true,
  name: true,
  sku: true,
  variant_attrs: true,
  unit_price: true,
  row_discount: true,
  row_tax: true,
  row_shipping: true,
  row_total: true,
  qty_ordered: true,
}).strict();

export const CartMeta = OrderSchema.pick({
  sub_total: true,
  discount_total: true,
  tax_total: true,
  shipping_total: true,
  grand_total: true,
  items_count: true,
  items_quantity: true,
}).strict();

export const Cart = z
  .object({
    items: z.array(CartItem),
    totals: CartMeta,
  })
  .strict()
  .nullable();

export const CartItemToUpdateQuantitySchema = CartItem.pick({
  line_id: true,
  uuid: true,
  variant_attrs: true,
  qty_ordered: true,
});
export const OrderTotalsSchema = OrderSchema.pick({
  sub_total: true,
  discount_total: true,
  tax_total: true,
  shipping_total: true,
  grand_total: true,
  payment_fee: true,
}).strict();
export const OrderListSchema = z.array(
  OrderSchema.pick({
    uuid: true,
    order_number: true,
    placed_at: true,
    status: true,
    grand_total: true,
    shipping_total: true,
    buyer_uuid: true,
    buyer_type: true,
    items: true,
  }).extend(
    z.object({
      buyer: z.object({
        name: z.string(),
      }),
    }),
  ),
);
export type TOrder = z.infer<typeof OrderSchema>;
export type TOrderItem = z.infer<typeof OrderItemSchema>;
export type TCart = z.infer<typeof Cart>;
export type TCartMeta = z.infer<typeof CartMeta>;
export type TCartItem = z.infer<typeof CartItem>;
export type TCartItemToUpdateQuantity = z.infer<
  typeof CartItemToUpdateQuantitySchema
>;
export type TOrderTotals = z.infer<typeof OrderTotalsSchema>;
export type TOrderList = z.infer<typeof OrderListSchema>;
