"use server";

import { ApiResponse, IMetaData } from "@/modules/core";
import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { handleUnknownError } from "@/modules/core/lib/utils.index";
import { ORDER_MANAGEMENT_ROUTES } from "@/modules/order.management/routes";
import { TOrder } from "@/modules/order.management/schemas/orderSchema";
import { TOrderShowPayloadSchema } from "@/modules/order.management/schemas/responsePayloads/OrderShowPayloadSchema";
import { isAxiosError } from "axios";

export const actionGetOrder = async (
  uuid: string,
): Promise<IMetaData | null | TOrder> => {
  try {
    const client = await authAxiosInstance();
    const response = await client.get(
      ORDER_MANAGEMENT_ROUTES.order.show.path.replace(":orderId", uuid),
    );

    const responseData = response.data as ApiResponse<TOrderShowPayloadSchema>;

    if (responseData.metaData.error) {
      return { error: responseData.metaData.error };
    }
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
