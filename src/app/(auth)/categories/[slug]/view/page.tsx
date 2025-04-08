import PageContainer from "@/modules/core/components/server/PageContainer";
import CategoryView from "@/modules/product.management/components/client/category/CategoryView";
import CategoryViewTanstack from "@/modules/product.management/components/client/category/CategoryView-Tanstack";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <PageContainer pageTitle={`View ${slug.replaceAll("-", " ")}`}>
      <CategoryViewTanstack slug={slug} />
    </PageContainer>
  );
}
