"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { actionGetOrders } from "@/modules/order.management/actions/actionGetOrders";
import { useState } from "react";

export default function Index() {
  const [orderList, setOrderList] = useState([]);
  // actionGetOrders()
  //   .then((orders) => {
  //     console.log(orders);
  //   })
  //   .catch((error) => {
  //     console.log("error on component fetching orders: ", error);
  //   });

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
          <form action={actionGetOrders}>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-row space-x-4 w-auto">
                <FilterDropdown
                  label="Payment Method"
                  id="payment_method"
                  options={[
                    { id: "all", label: "All", value: "all" },
                    { id: "cod", label: "COD", value: "cod" },
                    { id: "wallet", label: "WALLET", value: "wallet" },
                  ]}
                />
                <FilterDropdown
                  label="Status"
                  id="status"
                  options={[
                    { id: "all", label: "All", value: "all" },
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
                <DateFilter label="Placed Date Range" />
              </div>
              <div className="flex flex-row space-x-4 w-auto">
                <Button variant="default">Filter</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader />
        <CardContent>
          <Table />
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
}: {
  id: string;
  label: string;
  options: { id: string; label: string; value: string }[];
}) {
  return (
    <div className="flex flex-col items-center">
      <label htmlFor="status" className="block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        name={id}
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
function DateFilter({ label }: { label: string }) {
  return (
    <fieldset className="flex flex-row text-center">
      <legend className="block text-sm font-medium">{label}</legend>
      <div className="flex flex-row space-x-2 justify-items-center items-center">
        <label>From</label>
        <input
          type="date"
          id="from"
          name="from"
          className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
        <br />
        <label>To</label>
        <input
          type="date"
          id="to"
          name="to"
          className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </fieldset>
  );
}
