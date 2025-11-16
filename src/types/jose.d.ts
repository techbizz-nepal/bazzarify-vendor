import { SessionUserSchema } from "@/modules/auth/domain/schemas/UserSchema";
import "jose";

declare module "jose" {
  export interface JWTPayload extends z.infer<typeof SessionUserSchema> {}
}
