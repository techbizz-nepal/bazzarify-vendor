"use server";

import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { handleUnknownError } from "@/modules/core/lib/utils.index";
import { ORDER_MANAGEMENT_ROUTES } from "@/modules/order.management/routes";
import { isAxiosError } from "axios";

export interface TOrderStatusOption {
  code: string;
  label: string;
}

export const actionGetOrderStatuses = async () => {
  try {
    const client = await authAxiosInstance();
    const response = await client.get(
      ORDER_MANAGEMENT_ROUTES.order.statuses.path,
    );
    const responseData = response.data;

    if (responseData.metaData.error) {
      return { error: responseData.metaData.error };
    }

    return responseData.data.payload.statuses as TOrderStatusOption[];
  } catch (error) {
    if (isAxiosError(error)) {
      console.log("error fetch order statuses: ", error?.response?.data);
    } else {
      console.log("error fetch order statuses: ", error);
    }
    return handleUnknownError(error);
  }
};
