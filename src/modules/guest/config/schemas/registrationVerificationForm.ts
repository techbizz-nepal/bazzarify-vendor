import {
  otpField,
  passwordConfirmationField,
  passwordField,
  verificationPhoneField,
  withConfirmedPassword,
} from "@/modules/guest/config/schemas/verification.fields";
import { z } from "zod";

export const RegistrationVerificationFormSchema = withConfirmedPassword({
  phone: verificationPhoneField,
  otp: otpField,
  password: passwordField,
  password_confirmation: passwordConfirmationField,
  verified: z.boolean(),
});
export type RegistrationVerificationFormValues = z.infer<
  typeof RegistrationVerificationFormSchema
>;
