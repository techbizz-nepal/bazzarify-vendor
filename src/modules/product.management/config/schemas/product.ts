import { isValidRichTextEditorContent } from "@/modules/core/lib/utils.index";
import { TVariantPayload } from "@/modules/product.management";
import { z } from "zod";

export const CreateProductSchema = z.object({
  type: z.string(),
  name: z.string().min(8, "Product name must be at least 8 characters long"),
  base_price: z
    .string("Base price is not valid")
    .min(1, "Product base price is required")
    .refine((val) => /^(?:[1-9]\d*|0)(?:\.\d+)?$/.test(val), {
      message: "Base price must be 1 to 9 digits",
    }),
  description: z.string(),
  highlights: z.string().min(1, "Product highlights is required"),
  box_items: z.string().min(1, "Product box items is required"),
  category: z.uuid("Category is required"),
  variants: z
    .array(z.custom<TVariantPayload>())
    .min(1, "Select at least one variant"),
  // uploadedImages: z.array(z.any()),
  // existingImages: z.array(z.any()),
});
export const UpdateProductSchema = z.object({
  type: z.string(),
  uuid: z.uuid("Product id is required"),
  name: z.string().min(8, "Product name must be at least 8 characters long"),
  base_price: z
    .string()
    .min(1, "Product base price is required")
    .refine((val) => /^(?:[1-9]\d*|0)(?:\.\d+)?$/.test(val), {
      message: "Base price must be 1 to 9 digits",
    }),
  description: z.string().refine(isValidRichTextEditorContent, {
    message: "Product description is required",
  }),
  highlights: z.string().min(1, "Product highlights is required"),
  box_items: z.string().min(1, "Product box items is required"),
});
