"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ServerDataTable from "@/modules/core/components/client/ServerDataTable";
import { TableColumn } from "@/modules/core/components/client/DynamicTable";
import { TServerDataTableMeta } from "@/modules/core/domain/schemas/ServerDataTableMeta";
import { actionUpdateOrderStatus } from "@/modules/order.management/actions/actionUpdateOrderStatus";
import { TOrderStatusOption } from "@/modules/order.management/actions/actionGetOrderStatuses";
import { TOrderList } from "@/modules/order.management/schemas/orderSchema";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type OrderListItem = TOrderList[number];
type OrderListBuyer = {
  name?: string | null;
  email?: string | null;
};
type OrderListCountFields = {
  items_count?: number | null;
  item_count?: number | null;
  visible_items_count?: number | null;
  visible_item_quantity?: number | null;
};

interface OrdersServerTableProps {
  rows: OrderListItem[];
  table: TServerDataTableMeta;
  initialFilters: Record<string, string>;
  pagination: {
    currentPage: number;
    perPage?: number | null;
    from?: number | string | null;
    to?: number | string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  statusOptions: TOrderStatusOption[];
  canManageWholeOrder: boolean;
}

export default function OrdersServerTable({
  rows,
  table,
  initialFilters,
  pagination,
  statusOptions,
  canManageWholeOrder,
}: OrdersServerTableProps) {
  const router = useRouter();
  const [isUpdatingStatus, startStatusUpdate] = useTransition();

  const columns: TableColumn<OrderListItem>[] = [
    {
      key: "order_number",
      title: "Order Number",
    },
    {
      key: "items",
      title: canManageWholeOrder ? "Items Ordered" : "Your Items",
      render: (_, record) => {
        const counts = record as OrderListItem & OrderListCountFields;
        if (!canManageWholeOrder) {
          return counts.visible_items_count ?? counts.visible_item_quantity ?? 0;
        }

        return counts.items_count ?? counts.item_count ?? 0;
      },
    },
    {
      key: "placed_at",
      title: "Placed At",
      render: (value) => {
        if (typeof value !== "string" || value.length === 0) {
          return "-";
        }

        return new Date(value).toLocaleDateString();
      },
    },
    {
      key: "status",
      title: "Status",
    },
    {
      key: "payment_method",
      title: "Payment Method",
    },
    {
      key: "grand_total",
      title: "Grand Total",
      align: "right",
      render: (value) =>
        typeof value === "number" ? `$${value.toFixed(2)}` : "$0.00",
    },
    {
      key: "buyer.name",
      title: "Buyer",
      render: (_, record) => {
        const buyer = (record as { buyer?: OrderListBuyer | null }).buyer;
        return buyer?.name ?? buyer?.email ?? "-";
      },
    },
  ];

  if (canManageWholeOrder) {
    columns.push({
      key: "__status_actions",
      title: "Status Action",
      align: "right",
      render: (_, record) => (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              disabled={isUpdatingStatus || statusOptions.length === 0}
            >
              Update Status
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex w-56 flex-col gap-2">
            {statusOptions.map((statusOption) => (
              <Button
                key={statusOption.code}
                variant="outline"
                onClick={() => {
                  startStatusUpdate(async () => {
                    const result = await actionUpdateOrderStatus(
                      record.uuid,
                      statusOption.code,
                      `Order marked as ${statusOption.label.toLowerCase()} by super admin.`,
                    );

                    if (!("error" in result)) {
                      router.refresh();
                    }
                  });
                }}
              >
                {statusOption.label}
              </Button>
            ))}
          </PopoverContent>
        </Popover>
      ),
    });
  }

  return (
    <ServerDataTable
      title={canManageWholeOrder ? "Manage Orders" : "Store Orders"}
      description={
        canManageWholeOrder
          ? "Manage orders with server-driven filters, pagination, and backend-owned query behavior."
          : "Review only the order items that belong to your store. Whole-order status changes remain platform-admin controlled."
      }
      columns={columns}
      rows={rows}
      emptyMessage={
        canManageWholeOrder
          ? "No orders found for the current filters."
          : "No store-authorized orders found for the current filters."
      }
      table={table}
      initialFilters={initialFilters}
      pagination={pagination}
      rowActions={[
        { label: "View", hrefTemplate: "/orders/:uuid", variant: "default" },
      ]}
    />
  );
}
