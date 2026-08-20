import { PaginatedResponse } from "@/modules/core/domain/schemas/PaginatedResponse";
import { ServerDataTableMetaSchema } from "@/modules/core/domain/schemas/ServerDataTableMeta";
import { SliderWithImages } from "@/modules/marketing/domain/slider/schemas/Slider";
import { z } from "zod";

export const SliderResponse = PaginatedResponse(SliderWithImages);
export const SliderIndexResponsePayloadSchema = z
  .object({
    sliders: SliderResponse,
    table: ServerDataTableMetaSchema,
  })
  .strict();

export type TSliderWithImagesResponse = z.infer<typeof SliderResponse>;
export type TSliderIndexResponsePayload = z.infer<
  typeof SliderIndexResponsePayloadSchema
>;
