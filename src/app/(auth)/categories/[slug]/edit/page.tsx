import CategoryEdit from "@/modules/product.management/components/client/category/CategoryEdit";
import PageContainer from "@/modules/core/components/server/PageContainer";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <PageContainer pageTitle={`Edit ${slug.replaceAll("-", " ")}`}>
      <CategoryEdit slug={slug} />
    </PageContainer>
  );
}
