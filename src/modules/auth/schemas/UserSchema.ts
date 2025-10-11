import { z } from "zod";

export const UserSchema = z
  .object({
    uuid: z.uuid(),
    id: z.number().nullable(),
    authType: z.string(),
    name: z.string().nullable(),
    email: z.string(),
    phone: z.string().nullable(),
    email_verified_at: z.string().nullable(),
    phone_verified_at: z.string().nullable(),
    created_at: z.string().nullable(),
    updated_at: z.string().nullable(),
    deleted_at: z.string().nullable(),
  })
  .strict();
export type TUser = z.infer<typeof UserSchema>;
