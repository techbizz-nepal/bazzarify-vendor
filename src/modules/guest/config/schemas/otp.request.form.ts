import { z } from "zod";

export const OTPRequestFormSchema = z.object({
  phone: z
    .string()
    .min(10, { message: "Phone number must be 10 digit" })
    .max(10, { message: "Phone number must be 10 digit" })
    .regex(/^9\d{9}$/, {
      message: "Phone number is not valid",
    }),
  channel: z.string().optional(),
});

export type OTPRequestFormValues = z.infer<typeof OTPRequestFormSchema>;
