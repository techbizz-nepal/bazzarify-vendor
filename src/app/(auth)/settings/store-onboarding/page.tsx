import StoreOnboardingManagement from "@/modules/vendor/components/client/StoreOnboardingManagement";
import PageContainer from "@/modules/core/components/server/PageContainer";
import {
  actionGetAdminSellableCategories,
  actionGetAdminStoreOnboardingStoreTypes,
} from "@/modules/vendor/domain/store-actions";

export default async function StoreOnboardingSettingsPage() {
  const [storeTypes, sellableCategoryResponse] = await Promise.all([
    actionGetAdminStoreOnboardingStoreTypes(),
    actionGetAdminSellableCategories(),
  ]);

  const sellableCategories =
    "categories" in sellableCategoryResponse
      ? sellableCategoryResponse.categories.data
      : [];

  return (
    <PageContainer pageTitle="Store Onboarding Settings">
      <StoreOnboardingManagement
        storeTypes={storeTypes}
        sellableCategories={sellableCategories}
      />
    </PageContainer>
  );
}
