"use server";

import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { handleUnknownError } from "@/modules/core/lib/utils.index";
import { SLIDER_MANAGEMENT_ROUTES } from "@/modules/marketing/domain/slider/routes/slider-management";
import { isAxiosError } from "axios";

export const actionDeleteSlider = async (uuid: string) => {
  try {
    const client = await authAxiosInstance();
    const response = await client.delete(
      SLIDER_MANAGEMENT_ROUTES.delete.path.replace(":uuid", uuid),
    );
    const responseData = response.data;

    if (responseData?.metaData?.error) {
      return { error: responseData.metaData.error };
    }
    return responseData.data.payload;
  } catch (error) {
    const msg = isAxiosError(error) ? error?.response?.data : error;
    console.log("error slider delete: ", msg);
    return handleUnknownError(error);
  }
};
