import { z } from "zod";

export const StoreSchema = z
  .object({
    uuid: z.uuid(),
    user_uuid: z.uuid(),
    store_type_uuid: z.uuid().nullable().optional(),
    name: z.string(),
    slug: z.string(),
    short_name: z.string().nullable(),
    short_description: z.string().nullable(),
    email: z.email(),
    phone: z.string(),
    country: z.string().nullable(),
    city: z.string().nullable(),
    province: z.string().nullable(),
    created_at: z.string().optional(),
    updated_at: z.string().nullable().optional(),
    deleted_at: z.string().optional().nullable(),
    category_count: z.number().int().nonnegative().optional(),
    product_authoring_ready: z.boolean().optional(),
  })
  .strip();
export const SessionStoreSchema = StoreSchema.pick({
  name: true,
  slug: true,
  user_uuid: true,
  store_type_uuid: true,
  email: true,
  phone: true,
  short_description: true,
  city: true,
  province: true,
  country: true,
  category_count: true,
  product_authoring_ready: true,
}).strip();

export default StoreSchema;
export type TUser = z.infer<typeof SessionStoreSchema>;
export type TStoreSchema = z.infer<typeof StoreSchema>;
