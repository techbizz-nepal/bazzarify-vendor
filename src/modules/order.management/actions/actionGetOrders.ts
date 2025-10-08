"use server";

import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { handleUnknownError } from "@/modules/core/lib/utils.index";
import { ORDER_MANAGEMENT_ROUTES } from "@/modules/order.management/routes";

export const actionGetOrders = async (formData: FormData) => {
  try {
    const searchParams = new URLSearchParams(
      formData as unknown as Record<string, string>,
    );
    const client = await authAxiosInstance();
    const response = await client.get(
      [ORDER_MANAGEMENT_ROUTES.order.index.path, searchParams].join("?"),
    );

    const responseData = response.data; //as ApiResponse<TProductIndexPayload>;

    if (responseData.metaData.error) {
      return { error: responseData.metaData.error };
    }
    console.log("success fetch orders: ", responseData.data.payload.orders);
    return responseData.data.payload;
  } catch (error) {
    console.log("error fetch orders: ", error);
    return handleUnknownError(error);
  }
};
