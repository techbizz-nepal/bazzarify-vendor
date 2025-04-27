"use server";

import { ApiResponse, Entity, TURLSearchParams } from "@/modules/core";
import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { PRODUCT_MANAGEMENT_ROUTES } from "@/modules/product.management/config/routes";

export const actionGetProducts = async (
  params?: TURLSearchParams,
): Promise<ApiResponse<{ data: Entity[] }>> => {
  try {
    const axios = await authAxiosInstance();
    const response = await axios.get(
      PRODUCT_MANAGEMENT_ROUTES.product.index.path,
      {
        params,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products", error);
    throw error;
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
