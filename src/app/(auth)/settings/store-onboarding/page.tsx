import StoreOnboardingManagement from "@/modules/vendor/components/client/StoreOnboardingManagement";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { actionGetAdminStoreOnboardingStoreTypes } from "@/modules/vendor/domain/store-actions";

export default async function StoreOnboardingSettingsPage() {
  const storeTypes = await actionGetAdminStoreOnboardingStoreTypes();

  return (
    <PageContainer pageTitle="Store Onboarding Settings">
      <StoreOnboardingManagement storeTypes={storeTypes} />
    </PageContainer>
  );
}
