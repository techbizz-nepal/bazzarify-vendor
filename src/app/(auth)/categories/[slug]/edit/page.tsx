import BackLinkButton from "@/modules/core/components/server/BackLinkButton";
import PageContainer from "@/modules/core/components/server/PageContainer";
import Edit from "@/modules/product.management/components/client/category/Edit";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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
