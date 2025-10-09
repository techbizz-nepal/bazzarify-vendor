import { TableColumn } from "@/modules/core/components/client/DynamicTable";
import { OrderData } from "@/modules/core/types/dynamicTable";


export const orderIndexColumns: TableColumn<OrderData>[] = [
  {
    key: "order_number",
    title: "Order Number",
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
          value === "draft"
            ? "bg-gray-100 text-gray-800"
            : value === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : value === "processing"
                ? "bg-blue-100 text-blue-800"
                : value === "shipped"
                  ? "bg-purple-100 text-purple-800"
                  : value === "delivered"
                    ? "bg-green-100 text-green-800"
                    : value === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
        }`}
      >
        {value}
      </span>
    ),
  },
  {
    key: "sub_total",
    title: "Sub Total",
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
];
