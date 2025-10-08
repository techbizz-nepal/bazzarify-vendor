import { ApiResponse, IMetaData, TURLSearchParams } from "@/modules/core";
import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { handleUnknownError } from "@/modules/core/lib/utils.index";
import { ORDER_MANAGEMENT_ROUTES } from "@/modules/order.management/routes";
import { TProductIndexPayload } from "@/modules/product.management";

export const actionGetOrders = async (
  params?: TURLSearchParams,
): Promise<TProductIndexPayload | IMetaData> => {
  try {
    const client = await authAxiosInstance();
    const response = await client.get(
      ORDER_MANAGEMENT_ROUTES.order.index.path,
      {
        params,
      },
    );

    console.log("responseData: ", response.data);
    const responseData = response.data as ApiResponse<TProductIndexPayload>;

    if (responseData.metaData.error) {
      return { error: responseData.metaData.error };
    }
    console.log("success fetch orders: ", responseData.data);
    return responseData.data.payload;
  } catch (error) {
    console.log("error fetch orders: ", error);
    return handleUnknownError(error);
  }
};
