"use server";

import { ApiResponse, IMetaData } from "@/modules/core";
import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { handleUnknownError } from "@/modules/core/lib/utils.index";
import { PRODUCT_MANAGEMENT_ROUTES } from "@/modules/product.management/config/routes";

export const actionDelete = async (uuid: string): Promise<[] | IMetaData> => {
  const client = await authAxiosInstance();
  try {
    const response = await client.delete(
      PRODUCT_MANAGEMENT_ROUTES.image.delete.path.replace(":uuid", uuid),
    );
    const responseData = response.data as ApiResponse<[]>;
    if (responseData.metaData.error) {
      return { error: responseData.metaData.error };
    }
    return responseData.data.payload;
  } catch (error) {
    return handleUnknownError(error);
  }
};
