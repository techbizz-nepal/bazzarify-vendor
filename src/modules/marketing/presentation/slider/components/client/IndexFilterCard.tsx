"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useSliderIndexPage from "@/modules/marketing/presentation/slider//hooks/useSliderIndexPage";
import DateFilter from "@/modules/order.management/components/client/DateFilter";
import FilterDropdown from "@/modules/order.management/components/client/FilterDropdown";

interface Props {
  setQueryParamsAction: ReturnType<typeof useSliderIndexPage>["setQueryParams"];
  queryParams: ReturnType<typeof useSliderIndexPage>["queryParams"];
  isPending: ReturnType<typeof useSliderIndexPage>["isPending"];
  handleFilterSubmitAction: ReturnType<
    typeof useSliderIndexPage
  >["handleFilterSubmit"];
}
export default function IndexFilterCard({
  setQueryParamsAction,
  queryParams,
  isPending,
  handleFilterSubmitAction,
}: Props) {
  const { filters } = queryParams;
  return (
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
              label="Status"
              id="status"
              value={filters.status}
              onChange={(value) =>
                setQueryParamsAction((prev) => ({
                  ...prev,
                  filters: { ...prev.filters, status: value },
                }))
              }
              options={[
                { id: "all", label: "All", value: "null" },
                { id: "active", label: "Active", value: "active" },
                { id: "inActive", label: "Inactive", value: "inactive" },
              ]}
            />
            <DateFilter
              label="Placed Date Range"
              fromValue={filters.from}
              toValue={filters.to}
              onFromChange={(value) =>
                setQueryParamsAction((prev) => ({
                  ...prev,
                  filters: { ...prev.filters, from: value },
                }))
              }
              onToChange={(value) =>
                setQueryParamsAction((prev) => ({
                  ...prev,
                  filters: { ...prev.filters, to: value },
                }))
              }
            />
          </div>
          <div className="flex flex-row space-x-4 w-auto">
            <Button
              onClick={handleFilterSubmitAction}
              variant="default"
              disabled={isPending}
            >
              {isPending ? "Loading..." : "Filter"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
