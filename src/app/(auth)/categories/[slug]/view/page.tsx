import PageContainer from "@/modules/core/components/server/PageContainer";
import View from "@/modules/product.management/components/client/category/View";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pageTitle = slug.replaceAll("-", " ");
  return (
    <PageContainer pageTitle={`View ${pageTitle}`}>
      <View slug={slug} />
    </PageContainer>
  );
}
