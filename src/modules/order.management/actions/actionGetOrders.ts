"use server";

import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { handleUnknownError } from "@/modules/core/lib/utils.index";
import { TURLSearchParams } from "@/modules/core";
import { ORDER_MANAGEMENT_ROUTES } from "@/modules/order.management/routes";
import { isAxiosError } from "axios";

const buildOrderSearchParams = (
  params?: FormData | TURLSearchParams,
): URLSearchParams => {
  if (params instanceof FormData) {
    return new URLSearchParams(params as unknown as Record<string, string>);
  }

  return new URLSearchParams(
    Object.entries(params ?? {}).flatMap(([key, value]) => {
      if (value === undefined || value === null) {
        return [];
      }

      if (key === "filter" && typeof value === "object") {
        return Object.entries(value as Record<string, string>).flatMap(
          ([filterKey, filterValue]) =>
            filterValue ? [[`filter[${filterKey}]`, filterValue]] : [],
        );
      }

      return [[key, String(value)]];
    }),
  );
};

export const actionGetOrders = async (params?: FormData | TURLSearchParams) => {
  try {
    const searchParams = buildOrderSearchParams(params);
    const client = await authAxiosInstance();
    const response = await client.get(
      [ORDER_MANAGEMENT_ROUTES.order.index.path, searchParams].join("?"),
    );

    const responseData = response.data; //as ApiResponse<TOrderListPayloadSchema>;
    if (responseData.metaData.error) {
      return { error: responseData.metaData.error };
    }
    return responseData.data.payload;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log("error fetch orders: ", error?.response?.data);
    } else {
      console.log("error fetch orders: ", error);
    }
    return handleUnknownError(error);
  }
};
