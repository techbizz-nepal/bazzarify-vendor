import { phoneRegex } from "@/modules/core/lib/utils.index";
import { z } from "zod";
export const LoginFormSchema = z.object({
  credential: z
    .string()
    .min(1, "Required")
    .refine((val) => z.email().safeParse(val).success || phoneRegex.test(val), {
      message: "Must be a valid email or phone number",
    }),
  password: z.string().min(8).max(100),
});
export type LoginFormValues = z.infer<typeof LoginFormSchema>;
