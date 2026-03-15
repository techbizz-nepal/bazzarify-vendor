"use server";

import ApiResponseSchema from "@/modules/core/domain/schemas/ApiResponse";
import { TURLSearchParams } from "@/modules/core";
import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { handleUnknownError } from "@/modules/core/lib/utils.index";
import { SLIDER_MANAGEMENT_ROUTES } from "@/modules/marketing/domain/slider/routes/slider-management";
import { SliderIndexResponsePayloadSchema } from "@/modules/marketing/domain/slider/schemas/SliderIndexResponsePayload";
import { isAxiosError } from "axios";

const buildSliderSearchParams = (
  params?: FormData | TURLSearchParams,
): URLSearchParams => {
  if (params instanceof FormData) {
    return new URLSearchParams(params as unknown as Record<string, string>);
  }

  return new URLSearchParams(
    Object.entries(params ?? {}).flatMap(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        return [];
      }

      return [[key, String(value)]];
    }),
  );
};

export const actionGetSliders = async (params?: FormData | TURLSearchParams) => {
  try {
    const searchParams = buildSliderSearchParams(params);
    const client = await authAxiosInstance();
    const response = await client.get(
      [SLIDER_MANAGEMENT_ROUTES.index.path, searchParams].join("?"),
    );
    const parsed = ApiResponseSchema(SliderIndexResponsePayloadSchema).safeParse(
      response.data,
    );

    if (!parsed.success) {
      throw new Error("Slider index schema validation failed.");
    }

    if (parsed.data.metaData.error || parsed.data.data.payload === null) {
      return { error: parsed.data.metaData.error ?? "Unable to fetch sliders." };
    }

    return parsed.data.data.payload;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log("error fetch sliders: ", error?.response?.data);
    } else {
      console.log("error fetch sliders: ", error);
    }
    return handleUnknownError(error);
  }
};
