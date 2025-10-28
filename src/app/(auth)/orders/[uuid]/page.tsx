import { actionGetOrder } from "@/modules/order.management/actions/actionGetOrder";
import Show from "@/modules/order.management/components/client/order/Show";
import { Suspense } from "react";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  const order = await actionGetOrder(uuid);
  if (!order) {
    return <div>Loading...</div>;
  }
  if ("error" in order) {
    return <div>Something went wrong.</div>;
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Show order={order} />
    </Suspense>
  );
}
