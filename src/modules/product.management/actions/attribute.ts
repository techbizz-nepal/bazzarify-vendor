"use server";

import { ApiResponse, IMetaData, TURLSearchParams } from "@/modules/core";
import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { handleUnknownError } from "@/modules/core/lib/utils.index";
import { TAttributesIndexPayload } from "@/modules/product.management";
import { PRODUCT_MANAGEMENT_ROUTES } from "@/modules/product.management/config/routes";

export const actionGetAttributes = async (
  params?: TURLSearchParams,
): Promise<TAttributesIndexPayload | IMetaData> => {
  try {
    const response = await (
      await authAxiosInstance()
    ).get(PRODUCT_MANAGEMENT_ROUTES.attribute.index.path, { params });
    const responseData = response.data as ApiResponse<TAttributesIndexPayload>;
    if (responseData.metaData.error) {
      return { error: responseData.metaData.error };
    }
    return responseData.data.payload;
  } catch (error) {
    return handleUnknownError(error);
  }
};
