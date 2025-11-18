"use server";

import { setAuthUser } from "@/modules/auth/data/lib/auth-lib";
import { actionGetUser } from "@/modules/auth/domain/auth-actions";
import { TSessionUser } from "@/modules/auth/domain/schemas/UserSchema";
import { defaultAxiosInstance } from "@/modules/core/lib/utils.axios";
import { handleRemoteError } from "@/modules/core/lib/utils.index";
import { createAuthCookieSession } from "@/modules/core/lib/utils.session";
import { AUTH_ROUTES } from "@/modules/guest/config/routes";
import { RegistrationRequestFormValues } from "@/modules/guest/config/schemas/registrationRequestForm";
import { RegistrationVerificationFormValues } from "@/modules/guest/config/schemas/registrationVerificationForm";

export const actionRequestRegistration = async (
  data: RegistrationRequestFormValues,
) => {
  try {
    const response = await defaultAxiosInstance.post(
      AUTH_ROUTES.register.signup.path,
      data,
    );
    return response.data;
  } catch (error: unknown) {
    return handleRemoteError(error);
  }
};

export const actionVerifyRegistration = async (
  data: RegistrationVerificationFormValues,
) => {
  try {
    const response = await defaultAxiosInstance.post(
      AUTH_ROUTES.register.verifySignup.path,
      data,
    );
    // @ts-ignore
    if (response.data.data.message !== "success") {
      return handleRemoteError(new Error("Invalid login response"));
    }
    // @ts-ignore
    const tokenPlainText = response.data.data.payload.token;
    await createAuthCookieSession({
      token: tokenPlainText,
      userUUID: null,
    });
    const userResponse = await actionGetUser();
    if ("error" in userResponse) {
      throw userResponse.error;
    }
    const sessionUser: TSessionUser = userResponse;
    await createAuthCookieSession({
      token: tokenPlainText,
      userUUID: sessionUser.uuid,
    });
    await setAuthUser(sessionUser.uuid, sessionUser);
  } catch (error: unknown) {
    return handleRemoteError(error);
  }
};
