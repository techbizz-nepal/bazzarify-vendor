import { Slider } from "@/modules/marketing/domain/slider/schemas/Slider";
import { z } from "zod";

export const CreateSlider = Slider.pick({
  title: true,
  status: true,
  link: true,
}).extend(
  z.object({
    files: z.array(z.file()),
  }).shape,
);
