import { UserSchema } from "@/modules/auth01/domain/Schemas/UserSchema";
import { SliderStatus } from "@/modules/marketing/domain/slider/enums/SliderStatus";
import { ImageSchema } from "@/modules/product.management/schemas/ImageSchema";
import { z } from "zod";

export const Slider = z
  .object({
    uuid: z.uuid(),
    title: z
      .string()
      .min(2, { message: "title required must be at least 2 characters" })
      .max(50, { message: "title cannot be more than 50 characters" }),
    link: z.url({ message: "Invalid URL format." }).optional(),
    status: z
      .string()
      .refine(
        (val) => Object.values(SliderStatus).includes(val as SliderStatus),
        {
          message: "Invalid status value",
        },
      ),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    owner: UserSchema.nullable(),
    image_base_path: z.string(),
    image_base_url: z.string(),
  })
  .strip();

export const SliderWithImages = Slider.extend({
  images: z.array(ImageSchema).nullable(),
});

export type TSlider = z.infer<typeof Slider>;
export type TSliderWithImages = z.infer<typeof SliderWithImages>;
