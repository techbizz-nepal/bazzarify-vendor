import { phoneRegex } from "@/modules/core/lib/utils.index";
import { z } from "zod";

export const ResetPasswordFormSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be 10 digit" })
    .max(10, { message: "Phone number must be 10 digit" })
    .regex(phoneRegex, {
      message: "Phone number is not valid",
    }),
});
export type ResetPasswordFormValues = z.infer<typeof ResetPasswordFormSchema>;
