"use server";

import users from "@/modules/auth/domain/routes/user";
import SessionUserPayloadSchema from "@/modules/auth/domain/schemas/payloads/SessionUserPayloadSchema";
import { TSessionUser } from "@/modules/auth/domain/schemas/UserSchema";
import { ApiResponse, Entity, TURLSearchParams } from "@/modules/core";
import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { IApiMetaData } from "@/modules/core/schemas/response";
import { fetchAuthDataAndValidate } from "@/modules/core/utils/fetchAuthDataAndValidate";
import { handleError } from "@/modules/core/utils/jsonResponse.utils";

export const actionGetUsers = async () => {
  try {
    const response = await fetchAuthDataAndValidate(
      { module: "vendor", path: "auth/admin/user" },
      SessionUserPayloadSchema,
      "Unable to fetch user list.",
    );
    return response.user;
  } catch (e) {
    return handleError(e);
  }
};

export const actionGetUser = async (): Promise<TSessionUser | IApiMetaData> => {
  try {
    const response = await fetchAuthDataAndValidate(
      { module: "vendor", path: "auth/vendor/user" },
      SessionUserPayloadSchema,
      "Unable to fetch vendor user.",
    );
    return response.user;
  } catch (e) {
    return handleError(e);
  }
};

export const actionGetUserByUuid = async (
  userUuid: string,
  params?: TURLSearchParams,
): Promise<ApiResponse<{ data: Entity[] }>> => {
  try {
    const axios = await authAxiosInstance();
    const response = await axios.get(
      users.getByKey.path.replace(":uuid", userUuid),
      {
        params,
      },
    );
    console.log("response ", response.data.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products", error);
    throw error;
  }
};
