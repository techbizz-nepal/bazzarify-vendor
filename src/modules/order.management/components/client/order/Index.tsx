"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DynamicTable from "@/modules/core/components/client/DynamicTable";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { actionGetOrders } from "@/modules/order.management/actions/actionGetOrders";
import useOrderIndex from "@/modules/order.management/hooks/order/useOrderIndex";
import { useEffect, useTransition } from "react";

export default function Index() {
  const {
    appendFilterParams,
    filters,
    setFilters,
    columns,
    orderResponse,
    setOrderResponse,
  } = useOrderIndex();
  const [isPending, startTransition] = useTransition();

  const handleFormSubmit = async (formData: FormData) => {
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

  // Load initial orders on component mount with current filter state
  useEffect(() => {
    const loadInitialOrders = async () => {
      startTransition(async () => {
        try {
          // Create form data with current filter state
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

    loadInitialOrders();
  }, []); // Only run on mount, filters are already initialized from URL

  return (
    <PageContainer pageTitle="Manage Orders">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
          <CardDescription>
            Filter orders by status, date, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleFormSubmit}>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-row space-x-4 w-auto">
                <FilterDropdown
                  label="Payment Method"
                  id="payment_method"
                  value={filters.payment_method}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, payment_method: value }))
                  }
                  options={[
                    { id: "all", label: "All", value: "" },
                    { id: "cod", label: "COD", value: "cod" },
                    { id: "wallet", label: "WALLET", value: "wallet" },
                  ]}
                />
                <FilterDropdown
                  label="Status"
                  id="status"
                  value={filters.status}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, status: value }))
                  }
                  options={[
                    { id: "all", label: "All", value: "" },
                    { id: "draft", label: "Draft", value: "draft" },
                    { id: "pending", label: "Pending", value: "pending" },
                    {
                      id: "processing",
                      label: "Processing",
                      value: "processing",
                    },
                    { id: "shipped", label: "Shipped", value: "shipped" },
                    { id: "delivered", label: "Delivered", value: "delivered" },
                    { id: "cancelled", label: "Cancelled", value: "cancelled" },
                  ]}
                />
                <DateFilter
                  label="Placed Date Range"
                  fromValue={filters.from}
                  toValue={filters.to}
                  onFromChange={(value) =>
                    setFilters((prev) => ({ ...prev, from: value }))
                  }
                  onToChange={(value) =>
                    setFilters((prev) => ({ ...prev, to: value }))
                  }
                />
              </div>
              <div className="flex flex-row space-x-4 w-auto">
                <Button variant="default" disabled={isPending}>
                  {isPending ? "Loading..." : "Filter"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Orders</CardTitle>
          <CardDescription>
            {orderResponse
              ? `Showing ${orderResponse.from}-${orderResponse.to} of orders`
              : "No orders loaded yet. Use the filter above to load orders."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DynamicTable
            columns={columns}
            data={orderResponse?.data || []}
            loading={isPending}
            emptyMessage="No orders found. Try adjusting your filters."
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
}

function TableFilterSection() {
  return <div></div>;
}

function FilterDropdown({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string;
  label: string;
  options: { id: string; label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        name={`filter[${id}]`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      >
        {options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
function DateFilter({
  label,
  fromValue,
  toValue,
  onFromChange,
  onToChange,
}: {
  label: string;
  fromValue: string;
  toValue: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}) {
  return (
    <fieldset className="flex flex-row text-center">
      <legend className="block text-sm font-medium">{label}</legend>
      <div className="flex flex-row space-x-2 justify-items-center items-center">
        <label>From</label>
        <input
          type="date"
          id="from"
          name="filter[placed_at][]"
          value={fromValue}
          onChange={(e) => onFromChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
        <br />
        <label>To</label>
        <input
          type="date"
          id="to"
          name="filter[placed_at][]"
          value={toValue}
          onChange={(e) => onToChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </fieldset>
  );
}
