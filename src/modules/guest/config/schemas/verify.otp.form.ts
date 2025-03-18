import { z } from "zod";

export const VerifyOtpFormSchema = z
  .object({
    otp: z.string({ message: "OTP is required." }).min(6).max(6),
    password: z
      .string()
      .min(8, { message: "Password must contain at least 8 character(s)" })
      .max(100, {
        message: "Password must contain less than 100 character(s)",
      }),
    password_confirmation: z
      .string()
      .min(8, {
        message: "Password confirmation must contain at least 8 character(s)",
      })
      .max(100, {
        message: "Password must contain less than 100 character(s)",
      }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });
export type VerifyOtpFormValues = z.infer<typeof VerifyOtpFormSchema>;
