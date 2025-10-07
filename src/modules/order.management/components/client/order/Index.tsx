import { Card, CardHeader } from "@/components/ui/card";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { actionGetOrders } from "@/modules/order.management/actions/actionGetOrders";

export default function Index() {
  actionGetOrders()
    .then((orders) => {
      console.log(orders);
    })
    .catch((error) => {
      console.log(error);
    });
  return (
    <PageContainer pageTitle="Manage Orders">
      <Card>
        <CardHeader className="flex justify-end" />
      </Card>
    </PageContainer>
  );
}
