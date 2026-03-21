import { Card, CardHeader } from "@/components/ui/card";
import BackLinkButton from "@/modules/core/components/server/BackLinkButton";
import PageContainer from "@/modules/core/components/server/PageContainer";

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return (
    <PageContainer
      pageTitle={`View ${uuid}`}
      actionSlot={<BackLinkButton href="/products" label="Back to Products" />}
    >
      <Card>
        <CardHeader>{uuid}</CardHeader>
      </Card>
    </PageContainer>
  );
}
