import { UserSchema } from "@/modules/auth/schemas/UserSchema";
import { z } from "zod";

export const Slider = z
  .object({
    uuid: z.uuid(),
    title: z.string(),
    link: z.url().optional(),
    is_active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
    owner: UserSchema.nullable(),
  })
  .strip();

export type TSlider = z.infer<typeof Slider>;
