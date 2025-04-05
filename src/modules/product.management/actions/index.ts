"use server";

import axiosInstance from "@/modules/core/lib/utils.axios";
import { TURLSearchParams } from "@/modules/core";
import { PRODUCT_MANAGEMENT_ROUTES } from "@/modules/product.management/config/product.management.routes";

export const actionGetCategories = async (params: TURLSearchParams) => {
  try {
    const response = await axiosInstance.get(
      PRODUCT_MANAGEMENT_ROUTES.getCategories.path,
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
export const actionViewCategory = async (
  slug: string,
  params?: TURLSearchParams,
) => {
  try {
    const response = await axiosInstance.get(
      PRODUCT_MANAGEMENT_ROUTES.viewCategory.path.replace(":slug", slug),
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

export const actionUpdateCategory = async (
  slug: string,
  body: string,
  params?: TURLSearchParams,
) => {
  try {
    const response = await axiosInstance.put(
      PRODUCT_MANAGEMENT_ROUTES.updateCategory.path.replace(":slug", slug),
      body,
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
export const actionGetProducts = async (params: TURLSearchParams) => {
  try {
    const response = await axiosInstance.get(
      PRODUCT_MANAGEMENT_ROUTES.getProducts.path,
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

export const actionGetAttributes = async (params: TURLSearchParams) => {
  try {
    const response = await axiosInstance.get(
      PRODUCT_MANAGEMENT_ROUTES.getAttributes.path,
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
