import { TableColumn } from "@/modules/core/components/client/DynamicTable";
import { actionGetOrders } from "@/modules/order.management/actions/actionGetOrders";
import { useEffect, useState, useTransition } from "react";

interface OrderData {
  order_number: string;
  placed_at: string;
  status: string;
  sub_total: number;
  shipping_information: never;
  buyer_uuid: string;
  buyer_type: string;
  items: any[];
  buyer: any;
}

interface OrderResponse {
  current_page: number;
  data: OrderData[];
  first_page_url: string;
  from: number;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
}
interface IFilters {
  payment_method: string;
  status: string;
  from: string;
  to: string;
}
export default function useOrderIndex() {
  const [orderResponse, setOrderResponse] = useState<OrderResponse | null>(
    null,
  );

  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useState({
    payment_method: "",
    status: "",
    from: "",
    to: "",
  });
  useEffect(() => {
    const loadInitialOrders = async () => {
      startTransition(async () => {
        try {
          const formData = appendFilterParams(new FormData(), filters);
          const result = await actionGetOrders(formData);
          if (result.error) {
            console.error("Error fetching initial orders:", result.error);
          } else {
            setOrderResponse(result.orders);
          }
        } catch (error) {
          console.error("Error fetching initial orders:", error);
        }
      });
    };

    loadInitialOrders().then(() => undefined);
  }, []);
  const columns: TableColumn<OrderData>[] = [
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

  const appendFilterParams = (formData: FormData, filters: IFilters) => {
    if (filters.payment_method !== "null")
      formData.append("filter[payment_method]", filters.payment_method);
    if (filters.status !== "null")
      formData.append("filter[status]", filters.status);

    if (filters.from && filters.to) {
      formData.append(
        "filter[placed_between]",
        `${filters.from},${filters.to}`,
      );
    } else if (filters.from || filters.to) {
      if (filters.from) {
        formData.append("filter[placed_after]", filters.from);
      }
      if (filters.to) {
        formData.append("filter[placed_before]", filters.to);
      }
    }
    return formData;
  };
  const handleFormSubmit = async () => {
    // Use current filter state values instead of extracting from form
    const backendFormData = appendFilterParams(new FormData(), filters);

    startTransition(async () => {
      try {
        const result = await actionGetOrders(backendFormData);
        if (result.error) {
          console.error("Error fetching orders:", result.error);
        } else {
          setOrderResponse(result.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    });
  };
  return {
    columns,
    orderResponse,
    filters,
    isPending,
    setFilters,
    handleFormSubmit,
  };
}
