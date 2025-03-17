import { z } from "zod";
export const VerifyOtpFormSchema = z.object({
  otp: z.string().email({ message: "Email is required" }),
  password: z.string().min(8).max(100),
  password_confirmation: z.string().min(8).max(100),
});
export type VerifyOtpFormValues = z.infer<typeof VerifyOtpFormSchema>;
