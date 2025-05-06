"use server";

import { ApiResponse, Entity, TURLSearchParams } from "@/modules/core";
import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { PRODUCT_MANAGEMENT_ROUTES } from "@/modules/product.management/config/routes";

export const actionGetUsers = async (
  params?: TURLSearchParams,
): Promise<ApiResponse<{ data: Entity[] }>> => {
  try {
    const axios = await authAxiosInstance();
    const response = await axios.get(
      PRODUCT_MANAGEMENT_ROUTES.user.index.path,
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
