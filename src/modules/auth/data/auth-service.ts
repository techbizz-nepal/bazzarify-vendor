import {
  getAuthUser,
  getSessionUserUUID,
} from "@/modules/auth/data/lib/auth-lib";
import { TSessionUser } from "@/modules/auth/domain/schemas/UserSchema";
import { getCookieStore } from "@/modules/core/lib/utils.session";

export async function getSessionUser(): Promise<TSessionUser | null> {
  const userUUID = await getSessionUserUUID(await getCookieStore());
  if (!userUUID) {
    console.log("no token on dashboard: ", userUUID);
    return null;
  }
  const authUser = await getAuthUser(userUUID);
  if (authUser && "error" in authUser) {
    console.log("auth user: ", authUser);
    return null;
  }
  return authUser;
}
