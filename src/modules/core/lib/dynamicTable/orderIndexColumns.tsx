import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TableColumn } from "@/modules/core/components/client/DynamicTable";
import { OrderData } from "@/modules/core/types/dynamicTable";
import { TOrderStatusOption } from "@/modules/order.management/actions/actionGetOrderStatuses";
import Link from "next/link";

type TOrderIndexColumnParams = {
  statusOptions: TOrderStatusOption[];
  isUpdatingStatus: boolean;
  onUpdateStatus: (
    orderUuid: string,
    statusCode: string,
    statusLabel: string,
  ) => void;
};

export const orderIndexColumns = ({
  statusOptions,
  isUpdatingStatus,
  onUpdateStatus,
}: TOrderIndexColumnParams): TableColumn<OrderData>[] => [
  {
    key: "order_number",
    title: "Order Number",
    width: "200px",
  },
  {
    key: "items_count",
    title: "Items Ordered",
    width: "200px",
  },
  {
    key: "placed_at",
    title: "Placed At",
    width: "150px",
    render: (value: string) => {
      if (!value) return "-";
      return new Date(value).toLocaleDateString();
    },
  },
  {
    key: "status",
    title: "Status",
    width: "100px",
    render: (value: string) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === "confirmed"
            ? "bg-gray-100 text-gray-800"
            : value === "shipped"
              ? "bg-purple-100 text-purple-800"
              : value === "delivered"
                ? "bg-green-100 text-green-800"
                : value === "completed"
                  ? "bg-yellow-100 text-yellow-800"
                  : value === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : value === "returned"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-gray-100 text-gray-800"
        }`}
      >
        {value}
      </span>
    ),
  },
  {
    key: "grand_total",
    title: "Grand Total",
    width: "120px",
    align: "right" as const,
    render: (value: number) => `$${value?.toFixed(2) || "0.00"}`,
  },
  {
    key: "buyer.name",
    title: "Buyer",
    width: "150px",
    render: (value: string, record: OrderData) => {
      return record.buyer?.name || record.buyer?.email || "-";
    },
  },
  {
    key: "action",
    title: "Action",
    width: "100px",
    render: (value: string, record: OrderData) => (
      <div className="flex-row space-x-4 flex">
        <Link href={`/orders/${encodeURIComponent(record.uuid)}`}>
          <Button variant="default">View</Button>
        </Link>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={isUpdatingStatus || !statusOptions.length}
            >
              Update Status
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full flex flex-col space-y-3">
            {statusOptions.length ? (
              statusOptions.map((status) => (
                <Button
                  key={status.code}
                  variant="outline"
                  onClick={() =>
                    onUpdateStatus(record.uuid, status.code, status.label)
                  }
                >
                  {status.label}
                </Button>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">
                No statuses available.
              </p>
            )}
          </PopoverContent>
        </Popover>
      </div>
    ),
  },
];
