import {
  otpField,
  passwordConfirmationField,
  passwordField,
  verificationPhoneField,
  withConfirmedPassword,
} from "@/modules/guest/config/schemas/verification.fields";
import { z } from "zod";

export const ResetPasswordVerificationFormSchema = withConfirmedPassword({
  phone: verificationPhoneField,
  otp: otpField,
  password: passwordField,
  password_confirmation: passwordConfirmationField,
});

export type ResetPasswordVerificationFormValues = z.infer<
  typeof ResetPasswordVerificationFormSchema
>;
