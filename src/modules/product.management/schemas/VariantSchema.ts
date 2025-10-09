import { ImageSchema } from "@/modules/product.management/schemas/ImageSchema";
import { ProductSchema } from "@/modules/product.management/schemas/ProductSchema";
import { z } from "zod";

export const VariantSchema = z
  .object({
    uuid: z.uuid(),
    product_uuid: z.uuid(),
    name: z.string(),
    sku: z.string().min(8),
    price: z.float64().nonnegative().nonoptional(),
    stock: z.number().int(),
    available: z.boolean(),
    image_base_path: z.string(),
    image_base_url: z.string(),
    product: ProductSchema,
  })
  .strict();
export const VariantListWithImageSchema = VariantSchema.extend({
  images: z.array(ImageSchema).nullable().optional(),
}).strict();
export type TVariant = z.infer<typeof VariantSchema>;
export type TVariantListWithImage = z.infer<typeof VariantListWithImageSchema>;
