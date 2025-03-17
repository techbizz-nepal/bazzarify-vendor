import { z } from "zod";

export const ResetPasswordFormSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  phone: z.string().min(10).max(10),
});
export type ResetPasswordFormValues = z.infer<typeof ResetPasswordFormSchema>;
