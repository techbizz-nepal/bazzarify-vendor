"use server";

import { defaultAxiosInstance } from "@/modules/core/lib/utils.axios";
import { handleRemoteError } from "@/modules/core/lib/utils.index";
import { createSession } from "@/modules/core/lib/utils.session";
import { AUTH_ROUTES } from "@/modules/guest/config/routes";
import { LoginFormValues } from "@/modules/guest/config/schemas/login.form";
import { AxiosResponse } from "axios";

export const actionLogin = async (data: LoginFormValues) => {
  let apiResponse: AxiosResponse<unknown>;
  try {
    apiResponse = await defaultAxiosInstance.post(
      AUTH_ROUTES.login.loginCredentials.path,
      data,
    );
    // @ts-ignore
    if (apiResponse.data.data.message !== "success") {
      return handleRemoteError(new Error("Invalid login response"));
    }

    // @ts-ignore
    await createSession(apiResponse.data.data.payload.token);
  } catch (error: unknown) {
    return handleRemoteError(error);
  }
};
