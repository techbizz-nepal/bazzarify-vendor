import { PaginatedResponse } from "@/modules/core/domain/schemas/PaginatedResponse";
import { SliderWithImages } from "@/modules/marketing/domain/slider/schemas/Slider";
import { z } from "zod";

export const SliderResponse = PaginatedResponse(SliderWithImages);
export type TSliderWithImagesResponse = z.infer<typeof SliderResponse>;
