"use server";

import { ApiResponse, IMetaData } from "@/modules/core";
import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { handleUnknownError } from "@/modules/core/lib/utils.index";
import { SLIDER_MANAGEMENT_ROUTES } from "@/modules/marketing/domain/slider/routes/slider-management";
import { CreateSlider } from "@/modules/marketing/domain/slider/schemas/CreateSlider";
import { TSlider } from "@/modules/marketing/domain/slider/schemas/Slider";
import { z } from "zod";

export const actionStoreSlider = async (
  payload: z.infer<typeof CreateSlider>,
): Promise<{ slider: TSlider } | IMetaData> => {
  const client = await authAxiosInstance();
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("status", payload.status || "inactive");
  if (payload.files && payload.files.length > 0) {
    payload.files.forEach((file) => {
      formData.append("files[]", file);
    });
  }
  if (payload.link) formData.append("link", payload.link || "");
  console.log("payload: ", payload);
  try {
    const response = await client.post(
      SLIDER_MANAGEMENT_ROUTES.store.path,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      },
    );
    const responseData = response.data as ApiResponse<{ slider: TSlider }>;
    if (responseData.metaData?.error) {
      return { error: responseData.metaData.error };
    }
    return responseData.data.payload;
  } catch (error) {
    return handleUnknownError(error);
  }
};
