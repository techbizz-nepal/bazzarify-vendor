"use server";

import { TURLSearchParams } from "@/modules/core";
import ApiResponseSchema from "@/modules/core/domain/schemas/ApiResponse";
import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { handleUnknownError } from "@/modules/core/lib/utils.index";
import { ORDER_MANAGEMENT_ROUTES } from "@/modules/order.management/routes";
import { OrderListPayloadSchema } from "@/modules/order.management/schemas/responsePayloads/OrderListPayloadSchema";
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

    const parsed = ApiResponseSchema(OrderListPayloadSchema).safeParse(
      response.data,
    );

    if (!parsed.success) {
      throw new Error("Order list schema validation failed.");
    }

    if (parsed.data.metaData.error || parsed.data.data.payload === null) {
      return { error: parsed.data.metaData.error ?? "Unable to fetch orders." };
    }

    return parsed.data.data.payload;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log("error fetch orders: ", error?.response?.data);
    } else {
      console.log("error fetch orders: ", error);
    }
    return handleUnknownError(error);
  }
};
