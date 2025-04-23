import PageContainer from "@/modules/core/components/server/PageContainer";
import CategoryView from "@/modules/product.management/components/client/category/CategoryView";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pageTitle = slug.replaceAll("-", " ");
  return (
    <PageContainer pageTitle={`View ${pageTitle}`}>
      <CategoryView slug={slug} />
    </PageContainer>
  );
}
