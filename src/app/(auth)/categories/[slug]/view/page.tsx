import BackLinkButton from "@/modules/core/components/server/BackLinkButton";
import PageContainer from "@/modules/core/components/server/PageContainer";
import View from "@/modules/product.management/components/client/category/View";
import { requireAdminCategoryAccess } from "@/modules/product.management/utils/categoryAccess";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await requireAdminCategoryAccess("/products");
  const pageTitle = slug.replaceAll("-", " ");
  return (
    <PageContainer
      pageTitle={`View ${pageTitle}`}
      actionSlot={
        <BackLinkButton href="/categories" label="Back to Categories" />
      }
    >
      <View slug={slug} />
    </PageContainer>
  );
}
