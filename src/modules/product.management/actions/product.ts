import { TURLSearchParams } from "@/modules/core";
import axiosInstance from "@/modules/core/lib/utils.axios";
import { PRODUCT_MANAGEMENT_ROUTES } from "@/modules/product.management/config";

export const actionGetProducts = async (params: TURLSearchParams) => {
  try {
    const response = await axiosInstance.get(
      PRODUCT_MANAGEMENT_ROUTES.product.index.path,
      {
        params: {
          ...params,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
