import { SessionUserSchema } from "@/modules/auth/domain/schemas/UserSchema";
import { z } from "zod";

export const SessionUserPayloadSchema = z
  .object({
    user: SessionUserSchema,
  })
  .strip();

export default SessionUserPayloadSchema;

export type TSessionUserPayloadSchema = z.infer<
  typeof SessionUserPayloadSchema
>;
