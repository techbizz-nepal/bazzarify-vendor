"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { toTitleCase } from "@/modules/core/utils";
import { actionUpdateOrderStatus } from "@/modules/order.management/actions/actionUpdateOrderStatus";
import { TOrder } from "@/modules/order.management/schemas/orderSchema";
import { SyntheticEvent, useOptimistic, useState, useTransition } from "react";

export default function Show({ order }: { order: TOrder }) {
  const [orderStatus, setOrderStatus] = useState(order.status);
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    orderStatus,
    (currentState, optimisticValue) => optimisticValue as string,
  );
  const [isPending, startTransition] = useTransition();
  const handleOrderStatusChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const updatedStatus = e.currentTarget.value;

    startTransition(async () => {
      setOptimisticStatus(updatedStatus);
      try {
        const result = await actionUpdateOrderStatus(order.uuid, updatedStatus);
        if (result.error) {
          console.error("Error updating status:", result.error);
        } else {
          setOrderStatus(result.status);
        }
      } catch (error) {
        console.error(
          "Mock server error (should not happen in this version):",
          error,
        );
      }
    });
  };
  return (
    <PageContainer pageTitle="View Order">
      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic information</CardTitle>
            <CardDescription>
              View order details and manage order status.
            </CardDescription>
            <CardAction>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="default">Update Status</Button>
                </PopoverTrigger>
                <PopoverContent className="w-32 flex flex-col space-y-3">
                  <Button
                    value={"shipped"}
                    onClick={handleOrderStatusChange}
                    variant="outline"
                  >
                    Shipped
                  </Button>
                  <Button
                    value="delivered"
                    onClick={handleOrderStatusChange}
                    variant="outline"
                  >
                    Delivered
                  </Button>
                  <Button
                    value={"completed"}
                    onClick={handleOrderStatusChange}
                    variant="outline"
                  >
                    Completed
                  </Button>
                  <Button
                    value="returned"
                    onClick={handleOrderStatusChange}
                    variant="outline"
                  >
                    Returned
                  </Button>
                </PopoverContent>
              </Popover>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p>Order Number: {order.order_number}</p>
            <p>Status: {isPending ? "Updating status..." : optimisticStatus}</p>
            <p>Total Items: {order.item_count}</p>
            <p>Total Ordered Quantity: {order.item_quantity}</p>
            <p>Placed At: {order.placed_at}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Buyer information</CardTitle>
            <CardDescription>View buyer details</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Name: {order.buyer?.name}</p>
            <p>Email: {order.buyer?.email}</p>
            <p>Phone: {order.buyer?.phone}</p>
          </CardContent>
        </Card>
        {order.shipping_information && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shipping Information</CardTitle>
              <CardDescription>View order shipping information</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.entries(order.shipping_information).map(
                ([key, value]) => (
                  <p key={key}>
                    {toTitleCase(key)}: {value}
                  </p>
                ),
              )}
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment information</CardTitle>
            <CardDescription>View payment details</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Sub Total: {order.sub_total}</p>
            <p>Discount: {order.discount_total}</p>
            <p>Tax: {order.tax_total}</p>
            <p>Shipping: {order.shipping_total}</p>
            <p>Method: {order.payment_method}</p>
            <p>Type: {order.payment_status}</p>
            <p>Fee: {order.payment_fee}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Items</CardTitle>
          <CardDescription>View order items.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Shipping fee</TableHead>
                <TableHead>Payment fee</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order?.items?.map((item) => (
                <TableRow key={item.uuid}>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="truncate w-72">{item.name}</p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.unit_price}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.qty_ordered}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.row_discount}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.row_shipping}
                  </TableCell>
                  <TableCell className="text-right">
                    {order.payment_fee}
                  </TableCell>
                  <TableCell className="text-right">{item.row_total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="text-end">
              <TableRow>
                <TableCell colSpan={6}>Sub Total</TableCell>
                <TableCell className="text-right">{order.sub_total}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6}>Discount</TableCell>
                <TableCell className="text-right">
                  {order.discount_total}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6}>Tax</TableCell>
                <TableCell className="text-right">{order.tax_total}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6}>Shipping</TableCell>
                <TableCell className="text-right">
                  {order.shipping_total}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6}>Payment Fee</TableCell>
                <TableCell>{order.payment_fee}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6}>Grand Total</TableCell>
                <TableCell className="text-right">
                  {order.grand_total}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
