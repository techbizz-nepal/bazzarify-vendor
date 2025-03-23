"use server";

import {ResetPasswordFormValues} from "@/modules/guest/config/schemas/reset.password.form";
import axiosInstance from "@/modules/core/lib/utils.axios";
import {AxiosError} from "axios";
import {AUTH_ROUTES} from "@/modules/guest/config/auth.routes";
import {VerifyOtpFormValues} from "@/modules/guest/config/schemas/verify.otp.form";
import {redirect} from "next/navigation";
import {OTPRequestFormValues} from "@/modules/guest/config/schemas/otp.request.form";
import {BusinessAndEmailFormValues} from "@/modules/guest/config/schemas/set.business.email.form";

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
export const handlePasswordResetVerification = async (
    data: VerifyOtpFormValues,
) => {
    console.log(data);
    redirect("/login");
};

export const actionOTPRequest = async (data: OTPRequestFormValues) => data

export const actionOTPVerificationWithNewPassword = async (data: VerifyOtpFormValues) => data

export const actionSetBusinessAndEmail = async (data: BusinessAndEmailFormValues) => data
