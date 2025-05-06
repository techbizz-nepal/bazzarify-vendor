import PageContainer from "@/modules/core/components/server/PageContainer";
import Edit from "@/modules/product.management/components/client/category/Edit";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <PageContainer pageTitle={`Edit ${slug.replaceAll("-", " ")}`}>
      <Edit slug={slug} />
    </PageContainer>
  );
}
