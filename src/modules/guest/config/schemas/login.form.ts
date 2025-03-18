import { z } from "zod";
export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(8).max(100),
  remember: z.boolean().default(false),
});
export type LoginFormValues = z.infer<typeof LoginFormSchema>;
