"use server";

import { ResetPasswordFormValues } from "@/modules/guest/config/schemas/reset.password.form";
import { defaultAxiosInstance } from "@/modules/core/lib/utils.axios";
import { BusinessAndEmailFormValues } from "@/modules/guest/config/schemas/set.business.email.form";
import { AUTH_ROUTES } from "@/modules/guest/config/routes";
import { RegistrationVerificationFormValues } from "@/modules/guest/config/schemas/registrationVerificationForm";
import { handleRemoteError } from "@/modules/core/lib/utils.index";

export const actionRequestPasswordReset = async (
  data: ResetPasswordFormValues,
) => {
  try {
    const response = await defaultAxiosInstance.post(
      AUTH_ROUTES.reset.requestPasswordReset.path,
      data,
    );
    return response.data;
  } catch (error: unknown) {
    return handleRemoteError(error);
  }
};
export const handlePasswordResetVerification = async (
  data: RegistrationVerificationFormValues,
) => {
  console.log(data);
};

export const actionSetBusinessAndEmail = async (
  data: BusinessAndEmailFormValues,
) => {
  try {
    const response = await defaultAxiosInstance.post(
      AUTH_ROUTES.register.verifySignup.path,
      data,
    );
    return response.data;
  } catch (error: unknown) {
    return handleRemoteError(error);
  }
};
