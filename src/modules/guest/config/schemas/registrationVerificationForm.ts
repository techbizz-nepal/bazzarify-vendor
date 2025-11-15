import { phoneRegex } from "@/modules/core/lib/utils.index";
import { z } from "zod";

export const RegistrationVerificationFormSchema = z
  .object({
    phone: z
      .string()
      .min(10, { message: "Phone number must be 10 digit" })
      .max(10, { message: "Phone number must be 10 digit" })
      .regex(phoneRegex, {
        message: "Phone number is not valid",
      }),
    otp: z.string({ message: "OTP is required." }).min(6).max(6),
    password: z
      .string({ message: "Password is required." })
      .min(8, { message: "Password must contain at least 8 character(s)" })
      .max(100, {
        message: "Password must contain less than 100 character(s)",
      }),
    password_confirmation: z
      .string({ message: "Password confirmation is required." })
      .min(8, {
        message: "Password confirmation must contain at least 8 character(s)",
      })
      .max(100, {
        message: "Password must contain less than 100 character(s)",
      }),
    verified: z.boolean(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });
export type RegistrationVerificationFormValues = z.infer<
  typeof RegistrationVerificationFormSchema
>;
