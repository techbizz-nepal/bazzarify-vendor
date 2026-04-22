import StoreOnboardingManagement from "@/modules/vendor/components/client/StoreOnboardingManagement";
import { getSessionUser } from "@/modules/auth/data/auth-service";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { actionGetAdminStoreOnboardingStoreTypes } from "@/modules/vendor/domain/store-actions";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function StoreOnboardingSettingsPage() {
  const requestHeaders = await headers();
  const isVendor = requestHeaders.get("host")?.startsWith("vendor.");
  const sessionUser = await getSessionUser();
  const hasAdminAccess =
    sessionUser?.roles.some(
      (role) => role.name === "super-admin" || role.name === "admin",
    ) ?? false;

  if (isVendor || !hasAdminAccess) {
    redirect("/");
  }

  const storeTypes = await actionGetAdminStoreOnboardingStoreTypes();

  return (
    <PageContainer pageTitle="Store Onboarding Settings">
      <StoreOnboardingManagement storeTypes={storeTypes} />
    </PageContainer>
  );
}
