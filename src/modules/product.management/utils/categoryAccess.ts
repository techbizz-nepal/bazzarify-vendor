import "server-only";

import {
  getAuthUser,
  getSessionUserUUID,
} from "@/modules/auth/data/lib/auth-lib";
import { getCookieStore } from "@/modules/core/lib/utils.session";
import { redirect } from "next/navigation";

export async function requireAdminCategoryAccess(
  returnTo = "/",
): Promise<void> {
  const userUUID = await getSessionUserUUID(await getCookieStore());
  if (!userUUID) {
    redirect("/login");
  }

  const authUser = await getAuthUser(userUUID);
  if (!authUser || "error" in authUser) {
    redirect("/login");
  }

  const isAdmin = authUser.roles.some(
    (role) => role.name === "super-admin" || role.name === "admin",
  );

  if (!isAdmin) {
    redirect(returnTo);
  }
}
