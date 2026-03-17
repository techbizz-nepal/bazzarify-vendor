import { actionGetOrder } from "@/modules/order.management/actions/actionGetOrder";
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
    <Suspense fallback={<div>Loading...</div>}>
      <Show order={order} canManageWholeOrder={canManageWholeOrder} />
    </Suspense>
  );
}
