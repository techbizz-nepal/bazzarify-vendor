"use server";

import { defaultAxiosInstance } from "@/modules/core/lib/utils.axios";
import { extractRemoteErrorFeedback } from "@/modules/core/lib/utils.feedback";
import { handleRemoteError } from "@/modules/core/lib/utils.index";
import { AUTH_ROUTES } from "@/modules/guest/config/routes";
import { ResetPasswordFormValues } from "@/modules/guest/config/schemas/reset.password.form";
import { ResetPasswordVerificationFormValues } from "@/modules/guest/config/schemas/reset.password.verification.form";
import { toPasswordResetVerificationPayload } from "@/modules/guest/utils/passwordReset";

export const actionRequestPasswordReset = async (
  data: ResetPasswordFormValues,
) => {
  try {
    const response = await defaultAxiosInstance.post(
      AUTH_ROUTES.reset.requestPasswordReset.path,
      data,
    );
    const remoteError = extractRemoteErrorFeedback(response.data);
    if (remoteError) {
      return handleRemoteError(response.data);
    }
    return response.data;
  } catch (error: unknown) {
    return handleRemoteError(error);
  }
};

export const actionVerifyPasswordReset = async (
  data: ResetPasswordVerificationFormValues,
) => {
  try {
    const response = await defaultAxiosInstance.post(
      AUTH_ROUTES.reset.verifyResetPassword.path,
      toPasswordResetVerificationPayload(data),
    );
    const remoteError = extractRemoteErrorFeedback(response.data);
    if (remoteError) {
      return handleRemoteError(response.data);
    }
    return response.data;
  } catch (error: unknown) {
    return handleRemoteError(error);
  }
};
