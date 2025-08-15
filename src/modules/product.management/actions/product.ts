"use server";

import { ApiResponse, IMetaData, TURLSearchParams } from "@/modules/core";
import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { handleUnknownError } from "@/modules/core/lib/utils.index";
import {
  TEditProductPayload,
  TProductIndexPayload,
  TShowProductPayload,
} from "@/modules/product.management";
import { PRODUCT_MANAGEMENT_ROUTES } from "@/modules/product.management/config/routes";

export const actionGetProducts = async (
  params?: TURLSearchParams,
): Promise<TProductIndexPayload | IMetaData> => {
  try {
    const client = await authAxiosInstance();
    const response = await client.get(
      PRODUCT_MANAGEMENT_ROUTES.product.index.path,
      {
        params,
      },
    );
    const responseData = response.data as ApiResponse<TProductIndexPayload>;
    if (responseData.metaData.error) {
      return { error: responseData.metaData.error };
    }
    return responseData.data.payload;
  } catch (error) {
    return handleUnknownError(error);
  }
};

export const actionViewProduct = async (
  uuid: string,
): Promise<TShowProductPayload | IMetaData> => {
  const client = await authAxiosInstance();
  try {
    const response = await client.get(
      PRODUCT_MANAGEMENT_ROUTES.product.show.path.replace(":uuid", uuid),
    );
    const responseData = response.data as ApiResponse<TShowProductPayload>;
    if (responseData.metaData.error) {
      return { error: responseData.metaData.error };
    }
    return responseData.data.payload;
  } catch (error) {
    return handleUnknownError(error);
  }
};
export const actionEditProduct = async (
  uuid: string,
): Promise<TEditProductPayload | IMetaData> => {
  const client = await authAxiosInstance();
  try {
    const response = await client.get(
      PRODUCT_MANAGEMENT_ROUTES.product.edit.path.replace(":uuid", uuid),
    );
    const responseData = response.data as ApiResponse<TEditProductPayload>;
    if (responseData.metaData.error) {
      return { error: responseData.metaData.error };
    }
    return responseData.data.payload;
  } catch (error) {
    return handleUnknownError(error);
  }
};

export const actionStoreProducts = async (
  payload: FormData,
): Promise<[] | IMetaData> => {
  const client = await authAxiosInstance();
  try {
    const response = await client.post(
      PRODUCT_MANAGEMENT_ROUTES.product.store.path,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    const responseData = response.data as ApiResponse<[]>;

    console.log("payload", responseData);
    if (responseData.metaData?.error) {
      return { error: responseData.metaData.error };
    }
    return responseData.data.payload;
  } catch (error) {
    return handleUnknownError(error);
  }
};

export const actionUpdateProducts = async (
  payload: FormData,
  uuid: string,
): Promise<[] | IMetaData> => {
  const client = await authAxiosInstance();
  try {
    const response = await client.patch(
      PRODUCT_MANAGEMENT_ROUTES.product.update.path.replace(":uuid", uuid),
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
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
