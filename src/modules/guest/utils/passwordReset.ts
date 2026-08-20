import { ResetPasswordVerificationFormValues } from "@/modules/guest/config/schemas/reset.password.verification.form";

export const buildPasswordResetVerificationHref = (phone: string) =>
  `/verify-otp?phone=${encodeURIComponent(phone)}`;

export const toPasswordResetVerificationPayload = (
  data: ResetPasswordVerificationFormValues,
) => ({
  phone: data.phone,
  verification_code: data.otp,
  password: data.password,
  password_confirmation: data.password_confirmation,
});
