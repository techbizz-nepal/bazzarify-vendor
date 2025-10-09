"use server";

import { defaultAxiosInstance } from "@/modules/core/lib/utils.axios";
import { handleRemoteError } from "@/modules/core/lib/utils.index";
import { createSession } from "@/modules/core/lib/utils.session";
import { AUTH_ROUTES } from "@/modules/guest/config/routes";
import { LoginFormValues } from "@/modules/guest/config/schemas/login.form";
import { toast } from "sonner";

export const actionLogin = async (data: LoginFormValues) => {
  try {
    const response = await defaultAxiosInstance.post(
      AUTH_ROUTES.login.loginCredentials.path,
      data,
    );
    console.log("vendor login response: ", response.data);
    if (response === null) toast.error("Login failed");
    if (response.data.data.message === "success") {
      return await createSession(response.data.data.payload.token).then(() => {
        return response.data.data;
      });
    } else {
      return response.data.metaData;
    }
  } catch (error: unknown) {
    return handleRemoteError(error);
  }
};
