import PageContainer from "@/modules/core/components/server/PageContainer";
import CategoryView from "@/modules/product.management/components/client/category/CategoryView";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <PageContainer pageTitle={`View ${slug.replaceAll("-", " ")}`}>
      <CategoryView slug={slug} />
    </PageContainer>
  );
}
