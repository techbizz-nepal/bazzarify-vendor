import { Card, CardHeader } from "@/components/ui/card";
import PageContainer from "@/modules/core/components/server/PageContainer";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <PageContainer pageTitle={`View ${slug}`}>
      <Card>
        <CardHeader>{slug}</CardHeader>
      </Card>
    </PageContainer>
  );
}
