"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { toTitleCase } from "@/modules/core/utils";
import ItemCell from "@/modules/order.management/components/client/orderItem/ItemCell";
import useOrderShow from "@/modules/order.management/hooks/order/useOrderShow";
import { TOrder } from "@/modules/order.management/schemas/orderSchema";

export default function Show({ order }: { order: TOrder }) {
  const { isPending, optimisticStatus, handleOrderStatusChange } = useOrderShow(
    { order },
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Order Details</CardTitle>
        <CardDescription>Manage order information and status.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
        <Card className="grid md:col-span-2 grid-cols-1">
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
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order?.items?.map((item) => (
                  <TableRow key={item.uuid}>
                    <TableCell>
                      <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        defaultValue="item-1"
                      >
                        <AccordionItem value={item.uuid}>
                          <AccordionTrigger>
                            <p className="truncate w-72">{item.name}</p>
                          </AccordionTrigger>
                          <AccordionContent>
                            <ItemCell
                              item={item}
                              className="flex flex-col w-72 gap-4 text-balance"
                            />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
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
                      {item.row_total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className="text-end bg-transparent">
                <TableRow>
                  <TableCell className="text-left">Sub Total</TableCell>
                  <TableCell colSpan={5}>{order.sub_total}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-left">Discount</TableCell>
                  <TableCell colSpan={5}>{order.discount_total}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-left">Tax</TableCell>
                  <TableCell colSpan={5}>{order.tax_total}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-left">Shipping</TableCell>
                  <TableCell colSpan={5}>{order.shipping_total}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-left">Payment Fee</TableCell>
                  <TableCell colSpan={5}>{order.payment_fee}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-left">Grand Total</TableCell>
                  <TableCell colSpan={5}>{order.grand_total}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
