import { phoneRegex } from "@/modules/core/lib/utils.index";
import { z } from "zod";

export const SetBusinessAndEmailSchema = z.object({
  email: z.email({ message: "Email is required." }),
  business_name: z
    .string({ message: "Business name is required." })
    .min(3, { message: "Business name must be at least 3 characters." })
    .max(100, { message: "Business name must be less than 100 characters." })
    .regex(
      /^[a-zA-Z0-9&.,'’\- ]{3,50}$/,
      "Invalid characters in business name",
    ),
  phone: z
    .string()
    .min(10, { message: "Phone number must be 10 digit" })
    .max(10, { message: "Phone number must be 10 digit" })
    .regex(phoneRegex, {
      message: "Phone number is not valid",
    }),
});
export type BusinessAndEmailFormValues = z.infer<
  typeof SetBusinessAndEmailSchema
>;
