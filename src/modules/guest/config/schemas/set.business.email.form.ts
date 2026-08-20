import { phoneRegex } from "@/modules/core/lib/utils.index";
import { z } from "zod";

export const SetBusinessAndEmailSchema = z.object({
  email: z.email({ message: "Email is required." }),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters." })
    .max(100, { message: "Name must be less than 100 characters." })
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
  store_type_uuid: z.uuid({ message: "Store type is required." }),
});
export type BusinessAndEmailFormValues = z.infer<
  typeof SetBusinessAndEmailSchema
>;
