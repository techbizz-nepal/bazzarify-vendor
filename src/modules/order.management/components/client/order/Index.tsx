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

export default function Index() {
  actionGetOrders()
    .then((orders) => {
      console.log(orders);
    })
    .catch((error) => {
      console.log("error on component fetching orders: ", error);
    });
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
          <form>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-row space-x-4 w-auto">
                <div className="">
                  <label htmlFor="status" className="block text-sm font-medium">
                    Payment Method
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option>All</option>
                    <option>COD</option>
                    <option>WALLET</option>
                  </select>
                </div>
                <div className="">
                  <label htmlFor="status" className="block text-sm font-medium">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option>All</option>
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </div>
                <div className="">
                  <label htmlFor="date" className="block text-sm font-medium">
                    Placed Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
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
