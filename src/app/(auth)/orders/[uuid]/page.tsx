import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageContainer from "@/modules/core/components/server/PageContainer";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return (
    <PageContainer pageTitle="View Order">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic information</CardTitle>
          <CardDescription>
            View order details and manage order status.
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Items</CardTitle>
          <CardDescription>
            View order items and manage order items.
          </CardDescription>
        </CardHeader>
      </Card>
    </PageContainer>
  );
}
