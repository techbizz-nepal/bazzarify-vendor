import "server-only";

import { getAuthUser, getSessionUserUUID } from "@/modules/auth/data/lib/auth-lib";
import { getCookieStore } from "@/modules/core/lib/utils.session";
import { buildStoreRequirementPath } from "@/modules/vendor/domain/storeRequirementNavigation";
import { redirect } from "next/navigation";

export async function requireVendorStoreGuard(returnTo: string): Promise<void> {
  const userUUID = await getSessionUserUUID(await getCookieStore());
  if (!userUUID) {
    return;
  }

  const authUser = await getAuthUser(userUUID);
  if (!authUser || "error" in authUser) {
    return;
  }

  if (!authUser.store) {
    redirect(buildStoreRequirementPath(returnTo));
  }
}
