import ErrorComponent from "@/modules/core/components/client/ErrorComponent";
import BackLinkButton from "@/modules/core/components/server/BackLinkButton";
import PageContainer from "@/modules/core/components/server/PageContainer";
import ProductImportDetailScreen from "@/modules/product.management/components/client/product-import/ProductImportDetailScreen";
import { actionGetProductImport } from "@/modules/product.management/actions/import";

export default async function ProductImportDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ uuid: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { uuid } = await params;
  const resolvedSearchParams = await searchParams;
  const showResumedBanner = resolvedSearchParams?.resumed === "1";

  const payload = await actionGetProductImport(uuid);

  if (payload && typeof payload === "object" && "error" in payload) {
    return (
      <PageContainer
        pageTitle="Import Detail"
        actionSlot={
          <BackLinkButton href="/products/imports" label="Back to Imports" />
        }
      >
        <ErrorComponent err={payload.error} />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      pageTitle="Import Detail"
      actionSlot={
        <BackLinkButton href="/products/imports" label="Back to Imports" />
      }
    >
      <ProductImportDetailScreen
        initialImport={payload.import}
        showResumedBanner={showResumedBanner}
      />
    </PageContainer>
  );
}
