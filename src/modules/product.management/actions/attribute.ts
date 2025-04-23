"use server";

import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { PRODUCT_MANAGEMENT_ROUTES } from "@/modules/product.management/config/routes";

export const actionGetAttributes = async () => {
  try {
    const response = await (
      await authAxiosInstance()
    ).get(PRODUCT_MANAGEMENT_ROUTES.attribute.index.path);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
