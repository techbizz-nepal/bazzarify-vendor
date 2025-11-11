import { PaginatedResponse } from "@/modules/core/domain/schemas/PaginatedResponse";
import { Slider } from "@/modules/marketing/domain/slider/schemas/Slider";
import { z } from "zod";

export const SliderResponse = PaginatedResponse(Slider);
export type TSliderResponse = z.infer<typeof SliderResponse>;
