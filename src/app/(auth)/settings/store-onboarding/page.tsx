import StoreOnboardingManagement from "@/modules/vendor/components/client/StoreOnboardingManagement";
import PageContainer from "@/modules/core/components/server/PageContainer";
import {
  actionGetAdminLeafCategories,
  actionGetAdminStoreOnboardingStoreTypes,
} from "@/modules/vendor/domain/store-actions";

export default async function StoreOnboardingSettingsPage() {
  const [storeTypes, leafCategoryResponse] = await Promise.all([
    actionGetAdminStoreOnboardingStoreTypes(),
    actionGetAdminLeafCategories(),
  ]);

  const leafCategories =
    "categories" in leafCategoryResponse
      ? leafCategoryResponse.categories.data
      : [];

  return (
    <PageContainer pageTitle="Store Onboarding Settings">
      <StoreOnboardingManagement
        storeTypes={storeTypes}
        leafCategories={leafCategories}
      />
    </PageContainer>
  );
}
