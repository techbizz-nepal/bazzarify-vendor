import { UserSchema } from "@/modules/auth/domain/schemas/UserSchema";
import { z } from "zod";

export const UserIndexPayloadSchema = z
  .object({
    users: z.array(UserSchema),
  })
  .strip();

export default UserIndexPayloadSchema;

export type TUserIndexPayloadSchema = z.infer<typeof UserIndexPayloadSchema>;
