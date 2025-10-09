"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DynamicTable from "@/modules/core/components/client/DynamicTable";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { orderIndexColumns } from "@/modules/core/lib/dynamicTable/orderIndexColumns";
import DateFilter from "@/modules/order.management/components/client/DateFilter";
import FilterDropdown from "@/modules/order.management/components/client/FilterDropdown";
import useOrderIndex from "@/modules/order.management/hooks/order/useOrderIndex";

export default function Index() {
  const {
    setQueryParams,
    queryParams,
    orderResponse,
    isPending,
    handleFormSubmit,
    handleNextPage,
    handlePrevPage,
  } = useOrderIndex();
  const { filters, page } = queryParams;
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
          <div className="flex flex-col space-y-4">
            <div className="flex flex-row space-x-4 w-auto">
              <FilterDropdown
                label="Payment Method"
                id="payment_method"
                value={filters.payment_method}
                onChange={(value) =>
                  setQueryParams((prev) => ({
                    ...prev,
                    filters: { ...prev.filters, payment_method: value },
                  }))
                }
                options={[
                  { id: "all", label: "All", value: "null" },
                  { id: "cod", label: "COD", value: "cod" },
                  { id: "wallet", label: "WALLET", value: "wallet" },
                ]}
              />
              <FilterDropdown
                label="Status"
                id="status"
                value={filters.status}
                onChange={(value) =>
                  setQueryParams((prev) => ({
                    ...prev,
                    filters: { ...prev.filters, status: value },
                  }))
                }
                options={[
                  { id: "all", label: "All", value: "null" },
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
                  setQueryParams((prev) => ({
                    ...prev,
                    filters: { ...prev.filters, from: value },
                  }))
                }
                onToChange={(value) =>
                  setQueryParams((prev) => ({
                    ...prev,
                    filters: { ...prev.filters, to: value },
                  }))
                }
              />
            </div>
            <div className="flex flex-row space-x-4 w-auto">
              <Button
                onClick={handleFormSubmit}
                variant="default"
                disabled={isPending}
              >
                {isPending ? "Loading..." : "Filter"}
              </Button>
            </div>
          </div>
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
            columns={orderIndexColumns}
            data={orderResponse?.data || []}
            loading={isPending}
            emptyMessage="No orders found. Try adjusting your filters."
          />
        </CardContent>
        <CardFooter>
          <div className="flex flex-row items-center justify-between space-x-4">
            <Button
              onClick={handlePrevPage}
              variant="default"
              disabled={isPending || !orderResponse?.prev_page_url}
            >
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              variant="default"
              disabled={isPending || !orderResponse?.next_page_url}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </PageContainer>
  );
}
