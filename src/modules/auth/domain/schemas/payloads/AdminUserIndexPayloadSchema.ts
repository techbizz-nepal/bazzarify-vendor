import { SessionUserSchema } from "@/modules/auth/domain/schemas/UserSchema";
import StoreSchema from "@/modules/vendor/domain/schemas/store";
import { z } from "zod";

export const AdminUserListItemSchema = SessionUserSchema.extend({
  email_verified_at: z.string().nullable().optional(),
  phone_verified_at: z.string().nullable().optional(),
  store_status: z.enum(["no_store", "needs_categories", "ready"]),
  store: StoreSchema.extend({
    store_type_name: z.string().nullable().optional(),
  }).nullable(),
});

export const AdminUserIndexPayloadSchema = z
  .object({
    users: z.array(AdminUserListItemSchema),
  })
  .strip();

export type TAdminUserListItem = z.infer<typeof AdminUserListItemSchema>;
export type TAdminUserIndexPayload = z.infer<typeof AdminUserIndexPayloadSchema>;
