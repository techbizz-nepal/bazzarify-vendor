"use server";

import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { handleUnknownError } from "@/modules/core/lib/utils.index";
import { ORDER_MANAGEMENT_ROUTES } from "@/modules/order.management/routes";
import { isAxiosError } from "axios";

export const actionUpdateOrderItemFulfillment = async (
  orderUuid: string,
  itemUuid: string,
  action: "ship_remaining" | "cancel_remaining",
  note?: string,
) => {
  try {
    const client = await authAxiosInstance();
    const response = await client.patch(
      ORDER_MANAGEMENT_ROUTES.order.itemFulfillment.path
        .replace(":orderId", orderUuid)
        .replace(":itemId", itemUuid),
      { action, ...(note ? { note } : {}) },
    );

    const responseData = response.data;

    if (responseData.metaData.error) {
      return { error: responseData.metaData.error };
    }

    return responseData.data.payload;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(
        "error updating order item fulfillment: ",
        error?.response?.data,
      );
    } else {
      console.log("error updating order item fulfillment: ", error);
    }

    return handleUnknownError(error);
  }
};
