"use server";

import { TURLSearchParams } from "@/modules/core";
import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { PRODUCT_MANAGEMENT_ROUTES } from "@/modules/product.management/config/routes";

export const actionGetCategories = async (params?: TURLSearchParams) => {
  const response = await (
    await authAxiosInstance()
  ).get(PRODUCT_MANAGEMENT_ROUTES.category.index.path, {
    params: {
      ...params,
    },
  });
  return response.data;
};
export const actionViewCategory = async (
  slug: string,
  params?: TURLSearchParams,
) => {
  try {
    const response = await (
      await authAxiosInstance()
    ).get(PRODUCT_MANAGEMENT_ROUTES.category.show.path.replace(":slug", slug), {
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

export const actionUpdateCategory = async (
  slug: string,
  body: string,
  params?: TURLSearchParams,
) => {
  try {
    const response = await (
      await authAxiosInstance()
    ).put(
      PRODUCT_MANAGEMENT_ROUTES.category.update.path.replace(":slug", slug),
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
