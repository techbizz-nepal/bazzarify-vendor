import { SessionUserSchema } from "@/modules/auth/domain/schemas/UserSchema";
import "jose";
import { z } from "zod";

declare module "jose" {
  export interface JWTPayload {
    sessionUser?: z.infer<typeof SessionUserSchema>;
    token?: string;
    userUUID?: string | null;
    expiresAt?: string | Date;
    sub?: string;
  }
}
