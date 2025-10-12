"use server";

import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { handleUnknownError } from "@/modules/core/lib/utils.index";
import { ORDER_MANAGEMENT_ROUTES } from "@/modules/order.management/routes";
import { isAxiosError } from "axios";

export const actionUpdateOrderStatus = async (
  uuid: string,
  updatedStatus: string,
) => {
  try {
    const client = await authAxiosInstance();
    const response = await client.put(
      ORDER_MANAGEMENT_ROUTES.order.update.path.replace(":orderId", uuid),
      { status: updatedStatus },
    );

    const responseData = response.data; //as ApiResponse<TOrderShowPayloadSchema>;

    if (responseData.metaData.error) {
      return { error: responseData.metaData.error };
    }
    console.log("success fetch order: ", responseData.data.payload.order);
    return responseData.data.payload.order;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log("error fetch order: ", error?.response?.data);
    } else {
      console.log("error fetch order: ", error);
    }
    return handleUnknownError(error);
  }
};
