import { TURLSearchParams } from "@/modules/core";
import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { PRODUCT_MANAGEMENT_ROUTES } from "@/modules/product.management/config/routes";

export const actionGetProducts = async (params: TURLSearchParams) => {
  try {
    const response = await (
      await authAxiosInstance()
    ).get(PRODUCT_MANAGEMENT_ROUTES.product.index.path, {
      params: {
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const actionStoreProducts = async (payload: FormData) => {
  try {
    const response = await (
      await authAxiosInstance()
    ).post(PRODUCT_MANAGEMENT_ROUTES.product.store.path, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
