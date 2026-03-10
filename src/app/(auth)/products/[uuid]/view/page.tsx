import { Card, CardHeader } from "@/components/ui/card";
import PageContainer from "@/modules/core/components/server/PageContainer";

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return (
    <PageContainer pageTitle={`View ${uuid}`}>
      <Card>
        <CardHeader>{uuid}</CardHeader>
      </Card>
    </PageContainer>
  );
}
