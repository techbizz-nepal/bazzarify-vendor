"use server";

import { defaultAxiosInstance } from "@/modules/core/lib/utils.axios";
import { handleRemoteError } from "@/modules/core/lib/utils.index";
import { createSession } from "@/modules/core/lib/utils.session";
import { AUTH_ROUTES } from "@/modules/guest/config/routes";
import { LoginFormValues } from "@/modules/guest/config/schemas/login.form";

export const actionLogin = async (data: LoginFormValues) => {
  try {
    const response = await defaultAxiosInstance.post(
      AUTH_ROUTES.login.loginCredentials.path,
      data,
    );

    if (response.data.data.message === "success") {
      return await createSession(response.data.data.payload.token)
        .then(() => {
          return response.data.data;
        })
        .catch((err) => {
          console.log("create session error: ", err);
        });
    } else {
      return response.data.metaData;
    }
  } catch (error: unknown) {
    return handleRemoteError(error);
  }
};
