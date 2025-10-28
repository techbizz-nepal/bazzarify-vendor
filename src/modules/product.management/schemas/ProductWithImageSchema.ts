import { ImageSchema } from "@/modules/product.management/schemas/ImageSchema";
import { ProductSchema } from "@/modules/product.management/schemas/ProductSchema";
import { z } from "zod";

export const ProductWithImageSchema = ProductSchema.omit({
  id: true,
  box_items: true,
  specifications: true,
  highlights: true,
  description: true,
})
  .extend({
    images: z.array(ImageSchema).nullable(),
  })
  .strip();
