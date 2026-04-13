import { phoneRegex } from "@/modules/core/lib/utils.index";
import { z } from "zod";

export const verificationPhoneField = z
  .string()
  .min(10, { message: "Phone number must be 10 digit" })
  .max(10, { message: "Phone number must be 10 digit" })
  .regex(phoneRegex, {
    message: "Phone number is not valid",
  });

export const otpField = z
  .string({ message: "OTP is required." })
  .length(6, { message: "OTP must be 6 digits." });

export const passwordField = z
  .string({ message: "Password is required." })
  .min(8, { message: "Password must contain at least 8 character(s)" })
  .max(100, {
    message: "Password must contain less than 100 character(s)",
  });

export const passwordConfirmationField = z
  .string({ message: "Password confirmation is required." })
  .min(8, {
    message: "Password confirmation must contain at least 8 character(s)",
  })
  .max(100, {
    message: "Password must contain less than 100 character(s)",
  });

export const withConfirmedPassword = <T extends z.ZodRawShape>(shape: T) =>
  z.object(shape).refine((data) => {
    const values = data as {
      password: string;
      password_confirmation: string;
    };

    return values.password === values.password_confirmation;
  }, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });
