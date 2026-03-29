import ErrorComponent from "@/modules/core/components/client/ErrorComponent";
import BackLinkButton from "@/modules/core/components/server/BackLinkButton";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { getAuthUser, getSessionUserUUID } from "@/modules/auth/data/lib/auth-lib";
import { getCookieStore } from "@/modules/core/lib/utils.session";
import ProductImportScreen from "@/modules/product.management/components/client/product-import/ProductImportScreen";
import {
  actionGetProductImportGuide,
  actionGetProductImportTargetStores,
} from "@/modules/product.management/actions/import";
import { TProductImportTargetStore } from "@/modules/product.management";

export default async function ProductImportPage() {
  const guidePayload = await actionGetProductImportGuide();

  if ("error" in guidePayload) {
    return (
      <PageContainer
        pageTitle="Bulk Product Import"
        actionSlot={<BackLinkButton href="/products" label="Back to Products" />}
      >
        <ErrorComponent err={guidePayload.error} />
      </PageContainer>
    );
  }

  const userUuid = await getSessionUserUUID(await getCookieStore());
  const authUser = userUuid ? await getAuthUser(userUuid) : null;
  const isAdmin =
    authUser &&
    !("error" in authUser) &&
    authUser.roles.some(
      (role) => role.name === "super-admin" || role.name === "admin",
    );

  let initialStoreOptions: TProductImportTargetStore[] = [];
  let initialStoreOptionsError: string | null = null;

  if (isAdmin) {
    const storeOptionsPayload = await actionGetProductImportTargetStores();
    if ("error" in storeOptionsPayload) {
      initialStoreOptionsError = storeOptionsPayload.error;
    } else {
      initialStoreOptions = storeOptionsPayload.stores;
    }
  }

  return (
    <PageContainer
      pageTitle="Bulk Product Import"
      actionSlot={<BackLinkButton href="/products" label="Back to Products" />}
    >
      <ProductImportScreen
        guidePayload={guidePayload}
        initialStoreOptions={initialStoreOptions}
        initialStoreOptionsError={initialStoreOptionsError}
      />
    </PageContainer>
  );
}
