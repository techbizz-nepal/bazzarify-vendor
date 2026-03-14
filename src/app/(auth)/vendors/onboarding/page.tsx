import PageContainer from "@/modules/core/components/server/PageContainer";
import { actionGetAdminLeafCategories, actionGetAdminStoreOnboardingStoreTypes } from "@/modules/vendor/domain/store-actions";
import StoreOnboardingManagement from "@/modules/vendor/components/client/StoreOnboardingManagement";

export default async function VendorOnboardingManagementPage() {
  const [storeTypes, leafCategoryResponse] = await Promise.all([
    actionGetAdminStoreOnboardingStoreTypes(),
    actionGetAdminLeafCategories(),
  ]);

  const leafCategories =
    "categories" in leafCategoryResponse
      ? leafCategoryResponse.categories.data
      : [];

  return (
    <PageContainer pageTitle="Vendor Onboarding">
      <StoreOnboardingManagement
        storeTypes={storeTypes}
        leafCategories={leafCategories}
      />
    </PageContainer>
  );
}
