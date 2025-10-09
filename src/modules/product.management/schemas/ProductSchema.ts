import TimeStampsSchema from "@/modules/core/schemas/TimeStampsSchema";
import { ImageSchema } from "@/modules/product.management/schemas/ImageSchema";
import SpecificationSchema from "@/modules/product.management/schemas/SpecificationSchema";
import { z } from "zod";

export const ProductSchema = z
  .object({
    type: z.enum(["retail", "wholesale"]),
    uuid: z.uuid(),
    user_uuid: z.uuid().nullable(),
    image_base_path: z.string(),
    image_base_url: z.string(),
    id: z.number().nullable(),
    name: z.string(),
    sku: z.string().min(8).max(32),
    slug: z.string(),
    base_price: z.number().nonnegative(),
    description: z.looseObject({}).nullable(),
    highlights: z.looseObject({}).nullable(),
    box_items: z.string().nullable(),
    status_text: z.string(),
    brand_uuid: z.uuid().nullable(),
    status: z.number().nonnegative(),
    brand: z.object().nullable().optional(),
    images: z.union([z.array(ImageSchema).optional(), z.array(z.unknown())]),
  })
  .extend({
    specifications: SpecificationSchema,
  }) //TODO remove this from core product schema, extend it later
  .extend(TimeStampsSchema.shape)
  .strict();
export const OmittedProductWithImagesSchema = ProductSchema.omit({
  id: true,
  box_items: true,
  specifications: true,
  highlights: true,
  description: true,
  brand: true,
  user_uuid: true,
  brand_uuid: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
})
  .extend({
    images: z.array(ImageSchema).nullable(),
  })
  .strict();

export type TOmittedProductWithImages = z.infer<
  typeof OmittedProductWithImagesSchema
>;
