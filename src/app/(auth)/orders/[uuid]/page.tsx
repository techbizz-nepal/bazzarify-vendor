import { actionGetOrder } from "@/modules/order.management/actions/actionGetOrder";
import BackLinkButton from "@/modules/core/components/server/BackLinkButton";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { getSessionUser } from "@/modules/auth/data/auth-service";
import Show from "@/modules/order.management/components/client/order/Show";
import { Suspense } from "react";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  const [order, sessionUser] = await Promise.all([
    actionGetOrder(uuid),
    getSessionUser(),
  ]);
  if (!order) {
    return <div>Loading...</div>;
  }
  if ("error" in order) {
    return <div>Something went wrong.</div>;
  }
  const canManageWholeOrder =
    sessionUser?.roles.some((role) => role.name === "super-admin") ?? false;
  return (
    <PageContainer
      pageTitle={`Order ${order.order_number}`}
      actionSlot={<BackLinkButton href="/orders" label="Back to Orders" />}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Show order={order} canManageWholeOrder={canManageWholeOrder} />
      </Suspense>
    </PageContainer>
  );
}
