import { TURLSearchParams } from "@/modules/core";
import axiosInstance from "@/modules/core/lib/utils.axios";
import { PRODUCT_MANAGEMENT_ROUTES } from "@/modules/product.management/config";

export const actionGetCategories = async (params: TURLSearchParams) => {
  try {
    const response = await axiosInstance.get(
      PRODUCT_MANAGEMENT_ROUTES.category.index.path,
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
      PRODUCT_MANAGEMENT_ROUTES.category.show.path.replace(":slug", slug),
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
