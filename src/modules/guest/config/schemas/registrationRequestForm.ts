import { z } from "zod";
import { phoneRegex } from "@/modules/core/lib/utils.index";

export const RegistrationRequestFormSchema = z.object({
  phone: z
    .string()
    .min(10, { message: "Phone number must be 10 digit" })
    .max(10, { message: "Phone number must be 10 digit" })
    .regex(phoneRegex, {
      message: "Phone number is not valid",
    }),
  channel: z.string().optional(),
});

export type RegistrationRequestFormValues = z.infer<
  typeof RegistrationRequestFormSchema
>;
