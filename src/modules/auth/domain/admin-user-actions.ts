"use server";

import users from "@/modules/auth/domain/routes/user";
import {
  AdminUserDetailPayloadSchema,
  TAdminUserDetailPayload,
} from "@/modules/auth/domain/schemas/payloads/AdminUserDetailPayloadSchema";
import ApiResponseSchema from "@/modules/core/domain/schemas/ApiResponse";
import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { handleRemoteError } from "@/modules/core/lib/utils.index";

export const actionUpdateAdminUserRole = async ({
  userUuid,
  role,
}: {
  userUuid: string;
  role: "consumer" | "vendor";
}): Promise<TAdminUserDetailPayload | ReturnType<typeof handleRemoteError>> => {
  try {
    const instance = await authAxiosInstance();
    const response = await instance.patch(
      users.updateRole.path.replace(":uuid", userUuid),
      { role },
    );
    const parsed = ApiResponseSchema(AdminUserDetailPayloadSchema).safeParse(
      response.data,
    );

    if (!parsed.success) {
      throw new Error("Admin user role update schema validation failed.");
    }

    if (parsed.data.metaData.error || parsed.data.data.payload === null) {
      throw new Error(
        typeof parsed.data.metaData.error === "string"
          ? parsed.data.metaData.error
          : "Unable to update the user role.",
      );
    }

    return parsed.data.data.payload;
  } catch (error) {
    return handleRemoteError(error);
  }
};
