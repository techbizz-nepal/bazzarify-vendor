import { z } from "zod";

export const RolePivotSchema = z.object({
  model_type: z.string(),
  model_uuid: z.uuid(),
  role_uuid: z.uuid(),
});

export const RoleSchema = z.object({
  uuid: z.uuid(),
  name: z.string(),
  guard_name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  pivot: RolePivotSchema,
});
