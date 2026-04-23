import BackLinkButton from "@/modules/core/components/server/BackLinkButton";
import PageContainer from "@/modules/core/components/server/PageContainer";
import Edit from "@/modules/product.management/components/client/category/Edit";
import { requireAdminCategoryAccess } from "@/modules/product.management/utils/categoryAccess";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await requireAdminCategoryAccess("/products");
  return (
    <PageContainer
      pageTitle={`Edit ${slug.replaceAll("-", " ")}`}
      actionSlot={
        <BackLinkButton href="/categories" label="Back to Categories" />
      }
    >
      <Edit slug={slug} />
    </PageContainer>
  );
}
