import PageContainer from "@/modules/core/components/server/PageContainer";
import OrdersServerTable from "@/modules/order.management/components/client/order/OrdersServerTable";
import { actionGetOrders } from "@/modules/order.management/actions/actionGetOrders";
import { actionGetOrderStatuses } from "@/modules/order.management/actions/actionGetOrderStatuses";

const normalizeSingleValue = (
  value: string | string[] | undefined,
): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string | string[];
    page?: string | string[];
    payment_method?: string | string[];
    status?: string | string[];
    from?: string | string[];
    to?: string | string[];
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = normalizeSingleValue(resolvedSearchParams.search) ?? "";
  const page = Number(normalizeSingleValue(resolvedSearchParams.page) ?? "1");
  const paymentMethod =
    normalizeSingleValue(resolvedSearchParams.payment_method) ?? "";
  const status = normalizeSingleValue(resolvedSearchParams.status) ?? "";
  const from = normalizeSingleValue(resolvedSearchParams.from) ?? "";
  const to = normalizeSingleValue(resolvedSearchParams.to) ?? "";

  const [ordersResponse, statusOptionsResponse] = await Promise.all([
    actionGetOrders({
      page: Number.isFinite(page) && page > 0 ? page : 1,
      filter: {
        ...(search ? { order_number: search } : {}),
        ...(paymentMethod ? { payment_method: paymentMethod } : {}),
        ...(status ? { status } : {}),
        ...(from && to
          ? { placed_between: `${from},${to}` }
          : {
              ...(from ? { placed_after: from } : {}),
              ...(to ? { placed_before: to } : {}),
            }),
      },
    }),
    actionGetOrderStatuses(),
  ]);

  const orders =
    ordersResponse && typeof ordersResponse === "object" && "orders" in ordersResponse
      ? ordersResponse.orders
      : null;
  const statusOptions =
    Array.isArray(statusOptionsResponse) ? statusOptionsResponse : [];

  return (
    <PageContainer pageTitle="Manage Orders">
      <OrdersServerTable
        rows={orders?.data ?? []}
        initialFilters={{
          search,
          ...(paymentMethod ? { payment_method: paymentMethod } : {}),
          ...(status ? { status } : {}),
          ...(from ? { from } : {}),
          ...(to ? { to } : {}),
        }}
        pagination={{
          currentPage: Number(orders?.current_page ?? 1),
          perPage: orders?.per_page ? Number(orders.per_page) : null,
          from: orders?.from ?? null,
          to: orders?.to ?? null,
          hasNextPage: Boolean(orders?.next_page_url),
          hasPreviousPage: Boolean(orders?.prev_page_url),
        }}
        statusOptions={statusOptions}
      />
    </PageContainer>
  );
}
