import PageContainer from "@/modules/core/components/server/PageContainer";
import { getSessionUser } from "@/modules/auth/data/auth-service";
import { flattenSearchParams } from "@/modules/core/utils/searchParams";
import OrdersServerTable from "@/modules/order.management/components/client/order/OrdersServerTable";
import { actionGetOrders } from "@/modules/order.management/actions/actionGetOrders";
import { actionGetOrderStatuses } from "@/modules/order.management/actions/actionGetOrderStatuses";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const flattenedParams = flattenSearchParams(resolvedSearchParams);
  const page = Number(flattenedParams.page ?? "1");
  const sessionUser = await getSessionUser();
  const canManageWholeOrder =
    sessionUser?.roles.some((role) => role.name === "super-admin") ?? false;

  const [ordersResponse, statusOptionsResponse] = await Promise.all([
    actionGetOrders({
      ...flattenedParams,
      page: Number.isFinite(page) && page > 0 ? page : 1,
    }),
    canManageWholeOrder ? actionGetOrderStatuses() : Promise.resolve([]),
  ]);

  const orders =
    ordersResponse && typeof ordersResponse === "object" && "orders" in ordersResponse
      ? ordersResponse.orders
      : null;
  const table =
    ordersResponse &&
    typeof ordersResponse === "object" &&
    "table" in ordersResponse
      ? ordersResponse.table
      : null;
  const statusOptions =
    Array.isArray(statusOptionsResponse) ? statusOptionsResponse : [];

  return (
    <PageContainer pageTitle="Manage Orders">
      <OrdersServerTable
        rows={orders?.data ?? []}
        table={
          table ?? {
            search: {
              queryKey: "filter[order_number]",
              placeholder: "Search orders by order number...",
            },
            filters: [],
          }
        }
        initialFilters={Object.fromEntries(
          Object.entries(flattenedParams).filter(([key]) => key !== "page"),
        )}
        pagination={{
          currentPage: Number(orders?.current_page ?? 1),
          perPage: orders?.per_page ? Number(orders.per_page) : null,
          from: orders?.from ?? null,
          to: orders?.to ?? null,
          hasNextPage: Boolean(orders?.next_page_url),
          hasPreviousPage: Boolean(orders?.prev_page_url),
        }}
        statusOptions={statusOptions}
        canManageWholeOrder={canManageWholeOrder}
      />
    </PageContainer>
  );
}
