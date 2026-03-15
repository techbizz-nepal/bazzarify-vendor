import users from "@/modules/auth/domain/routes/user";
import {
  AdminUserDetailPayloadSchema,
  TAdminUserDetailPayload,
} from "@/modules/auth/domain/schemas/payloads/AdminUserDetailPayloadSchema";
import {
  AdminUserIndexPayloadSchema,
  TAdminUserIndexPayload,
} from "@/modules/auth/domain/schemas/payloads/AdminUserIndexPayloadSchema";
import SessionUserPayloadSchema from "@/modules/auth/domain/schemas/payloads/SessionUserPayloadSchema";
import { TSessionUser } from "@/modules/auth/domain/schemas/UserSchema";
import { TURLSearchParams } from "@/modules/core";
import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { IApiMetaData } from "@/modules/core/schemas/response";
import { fetchAuthDataAndValidate } from "@/modules/core/utils/fetchAuthDataAndValidate";
import { handleError } from "@/modules/core/utils/jsonResponse.utils";
import ApiResponseSchema from "@/modules/core/domain/schemas/ApiResponse";
import { formattedIssues } from "@/modules/core/utils/zod.util";

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

export const actionGetUsers = async (
  params?: TURLSearchParams | FormData,
): Promise<TAdminUserIndexPayload | IApiMetaData> => {
  try {
    const axios = await authAxiosInstance();
    const searchParams =
      params instanceof FormData
        ? new URLSearchParams(params as unknown as Record<string, string>)
        : new URLSearchParams(
            Object.entries(params ?? {}).flatMap(([key, value]) => {
              if (key === "filter" && typeof value === "object" && value !== null) {
                return Object.entries(value as Record<string, string>).flatMap(
                  ([filterKey, filterValue]) =>
                    filterValue ? [[`filter[${filterKey}]`, filterValue]] : [],
                );
              }

              if (value === undefined || value === null || value === "") {
                return [];
              }

              return [[key, String(value)]];
            }),
          );
    const response = await axios.get(["auth/admin/users", searchParams].join("?"), {
    });
    const parsed = ApiResponseSchema(AdminUserIndexPayloadSchema).safeParse(
      response.data,
    );

    if (!parsed.success) {
      console.log(
        "schema error on fetch admin users:",
        formattedIssues(parsed.error.issues),
      );
      throw new Error("Admin users schema validation failed.");
    }

    if (parsed.data.data.payload === null) {
      throw new Error("Admin users payload was null.");
    }

    return parsed.data.data.payload;
  } catch (e) {
    return handleError(e);
  }
};

export const actionGetUserByUuid = async (
  userUuid: string,
  params?: TURLSearchParams,
): Promise<TAdminUserDetailPayload | IApiMetaData> => {
  try {
    const axios = await authAxiosInstance();
    const response = await axios.get(
      users.getByKey.path.replace(":uuid", userUuid),
      {
        params,
      },
    );
    const parsed = ApiResponseSchema(AdminUserDetailPayloadSchema).safeParse(
      response.data,
    );

    if (!parsed.success) {
      console.log(
        "schema error on fetch admin user detail:",
        formattedIssues(parsed.error.issues),
      );
      throw new Error("Admin user detail schema validation failed.");
    }

    if (parsed.data.data.payload === null) {
      throw new Error("Admin user detail payload was null.");
    }

    return parsed.data.data.payload;
  } catch (error) {
    return handleError(error);
  }
};
