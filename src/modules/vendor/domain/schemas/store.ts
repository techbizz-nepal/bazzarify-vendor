import { z } from "zod";

export const StoreSchema = z
  .object({
    uuid: z.uuid(),
    user_uuid: z.uuid(),
    name: z.string(),
    slug: z.string(),
    short_name: z.string(),
    short_description: z.string().nullable(),
    email: z.email(),
    phone: z.string(),
    country: z.string().nullable(),
    city: z.string().nullable(),
    province: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
    deleted_at: z.string(),
  })
  .strip();
export const SessionStoreSchema = StoreSchema.pick({
  name: true,
  slug: true,
  user_uuid: true,
  email: true,
  phone: true,
  short_description: true,
  city: true,
  province: true,
  country: true,
}).strip();

export default StoreSchema;
export type TUser = z.infer<typeof SessionStoreSchema>;
export type TStoreSchema = z.infer<typeof StoreSchema>;
