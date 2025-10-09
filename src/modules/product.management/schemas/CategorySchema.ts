import { ImageSchema } from "@/modules/product.management/schemas/ImageSchema";
import { z } from "zod";

export const CategoryCore = z
  .object({
    uuid: z.uuid(),
    id: z.string().optional(),
    name: z.string(),
    position: z.string().optional(),
    slug: z.string(),
    image_base_path: z.string(),
    image_base_url: z.string(),
    specifications: z.array(z.string()).optional(),
    attributes: z.array(z.string()).optional(),
  })
  .strict();

export const CategoryWithImageSchema = CategoryCore.extend({
  images: z.array(ImageSchema).nullable(),
}).strict();

export const CategoryRecursiveWithImageSchema: typeof CategoryWithImageSchema =
  CategoryWithImageSchema.extend({
    parent: z.lazy(() => CategoryRecursiveWithImageSchema).optional(),
    children: z
      .array(z.lazy(() => CategoryRecursiveWithImageSchema))
      .optional(),
  });
export type TCategoryCore = z.infer<typeof CategoryCore>;
export type TCategoryWithImageSchema = z.infer<typeof CategoryWithImageSchema>;
export type TCategoryRecursiveWithImage = z.infer<
  typeof CategoryRecursiveWithImageSchema
>;
