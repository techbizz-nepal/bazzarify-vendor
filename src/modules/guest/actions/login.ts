"use server";

import { LoginFormValues } from "@/modules/guest/config/schemas/login.form";
import { defaultAxiosInstance } from "@/modules/core/lib/utils.axios";
import { AUTH_ROUTES } from "@/modules/guest/config/routes";
import { handleRemoteError } from "@/modules/core/lib/utils.index";
import { createSession } from "@/modules/core/lib/utils.session";

export const actionLogin = async (data: LoginFormValues) => {
  try {
    const response = await defaultAxiosInstance.post(
      AUTH_ROUTES.login.loginCredentials.path,
      data,
    );
    if (response.data.data.message === "success") {
      return await createSession(response.data.data.payload.token).then(() => {
        return response.data.data;
      });
    }
  } catch (error: unknown) {
    return handleRemoteError(error);
  }
};
