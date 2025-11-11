"use server";

import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { handleUnknownError } from "@/modules/core/lib/utils.index";
import { SLIDER_MANAGEMENT_ROUTES } from "@/modules/marketing/domain/slider/routes/slider-management";
import { isAxiosError } from "axios";

export const actionGetSliders = async (formData: FormData) => {
  try {
    const searchParams = new URLSearchParams(
      formData as unknown as Record<string, string>,
    );
    const client = await authAxiosInstance();
    const response = await client.get(
      [SLIDER_MANAGEMENT_ROUTES.index.path, searchParams].join("?"),
    );
    const responseData = response.data; //as ApiResponse<TOrderListPayloadSchema>;
    if (responseData.metaData.error) {
      return { error: responseData.metaData.error };
    }
    return responseData.data.payload;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log("error fetch sliders: ", error?.response?.data);
    } else {
      console.log("error fetch sliders: ", error);
    }
    return handleUnknownError(error);
  }
};
