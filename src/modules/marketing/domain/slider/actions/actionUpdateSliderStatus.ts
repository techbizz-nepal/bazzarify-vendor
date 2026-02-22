"use server";

import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { handleUnknownError } from "@/modules/core/lib/utils.index";
import { SLIDER_MANAGEMENT_ROUTES } from "@/modules/marketing/domain/slider/routes/slider-management";
import { isAxiosError } from "axios";

export const actionUpdateSliderStatus = async (
  uuid: string,
  updatedStatus: string,
) => {
  try {
    const client = await authAxiosInstance();
    const response = await client.put(
      //TODO update route
      SLIDER_MANAGEMENT_ROUTES.updateStatus.path.replace(":uuid", uuid),
      { status: updatedStatus },
    );

    const responseData = response.data; //as ApiResponse<TOrderShowPayloadSchema>;

    if (responseData.metaData.error) {
      return { error: responseData.metaData.error };
    }
    console.log("success slider update: ", responseData.data.payload.order);
    return responseData.data.payload.slider;
  } catch (error) {
    const msg = isAxiosError(error) ? error?.response?.data : error;
    console.log("error slider update: ", msg);
    return handleUnknownError(error);
  }
};
