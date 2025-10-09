import { ImageSchema } from "@/modules/product.management/schemas/ImageSchema";
import { ProductSchema } from "@/modules/product.management/schemas/ProductSchema";
import { VariantListWithImageSchema } from "@/modules/product.management/schemas/VariantSchema";
import { z } from "zod";

export const ProductWithVariantAndImageSchema = ProductSchema.extend({
  images: z.array(ImageSchema).nullable(),
})
  .extend({
    variants: z.array(VariantListWithImageSchema).nullable(),
  })
  .strict();

export type TProductWithVariantAndImage = z.infer<
  typeof ProductWithVariantAndImageSchema
>;
