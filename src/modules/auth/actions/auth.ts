"use server";

import { AUTH_ROUTES } from "@/modules/auth/config/auth.routes";
import { ResetPasswordFormValues } from "@/form.schema/reset.password.form";
import axiosInstance from "@/lib/utils.axios";
import { AxiosError } from "axios";

export const actionResetPassword = async (data: ResetPasswordFormValues) => {
  try {
    const response = await axiosInstance.post(
      AUTH_ROUTES.passwordResetRequest.path,
      data,
    );
    return response.data;
  } catch (error) {
    let message: string = "Something went wrong!";
    let errorCode = 500;
    if (error instanceof AxiosError) {
      message = error.response?.data?.message;
      errorCode = error.response?.data?.errorCode;
    }
    return {
      metaData: {
        error: message,
        errorCode: errorCode,
      },
    };
  }
};
