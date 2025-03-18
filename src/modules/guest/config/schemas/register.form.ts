import { z } from "zod";

export const RegisterFormSchema = z
  .object({
    name: z.string().min(3, { message: "Name is required" }),
    email: z.string().email({ message: "Email is required" }),
    phone: z
      .string()
      .min(10, { message: "Phone number must be 10 digit" })
      .max(10, { message: "Phone number must be 10 digit" }),
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
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });
export type RegisterFormValues = z.infer<typeof RegisterFormSchema>;
