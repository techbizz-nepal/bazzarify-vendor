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

export default function Show({
  order,
  canManageWholeOrder,
}: {
  order: TOrder;
  canManageWholeOrder: boolean;
}) {
  const {
    isPending,
    optimisticStatus,
    statusOptions,
    handleOrderStatusChange,
  } = useOrderShow({ order, canManageWholeOrder });

  const scopedItemCount = order.items.length;
  const scopedQuantity = order.items.reduce(
    (total, item) => total + item.qty_ordered,
    0,
  );
  const scopedSubtotal = order.items.reduce(
    (total, item) => total + item.row_total,
    0,
  );
  const scopedDiscount = order.items.reduce(
    (total, item) => total + item.row_discount,
    0,
  );
  const scopedTax = order.items.reduce((total, item) => total + item.row_tax, 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Order Details</CardTitle>
        <CardDescription>
          {canManageWholeOrder
            ? "Manage full order information and platform-level status."
            : "Review the items in this order that belong to your store."}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic information</CardTitle>
            <CardDescription>
              {canManageWholeOrder
                ? "View full order details and manage order status."
                : "View the platform order identifier and your scoped fulfillment slice."}
            </CardDescription>
            {canManageWholeOrder ? (
              <CardAction>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="default" disabled={!statusOptions.length}>
                      Update Status
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full flex flex-col space-y-3">
                    {statusOptions.length ? (
                      statusOptions.map((status) => (
                        <Button
                          key={status.code}
                          value={status.code}
                          data-note={`Order marked as ${status.label.toLowerCase()} by super admin.`}
                          onClick={handleOrderStatusChange}
                          variant="outline"
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
              </CardAction>
            ) : null}
          </CardHeader>
          <CardContent>
            <p>Order Number: {order.order_number}</p>
            <p>Status: {isPending ? "Updating status..." : optimisticStatus}</p>
            <p>
              {canManageWholeOrder ? "Total Items" : "Your Store Items"}:{" "}
              {canManageWholeOrder ? order.item_count : scopedItemCount}
            </p>
            <p>
              {canManageWholeOrder
                ? "Total Ordered Quantity"
                : "Your Store Quantity"}
              : {canManageWholeOrder ? order.item_quantity : scopedQuantity}
            </p>
            <p>Placed At: {order.placed_at}</p>
            {!canManageWholeOrder ? (
              <p className="text-sm text-muted-foreground">
                Whole-order status is platform-managed. You are only viewing the
                items assigned to your store.
              </p>
            ) : null}
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
            <CardTitle className="text-lg">
              {canManageWholeOrder ? "Payment information" : "Your Store Totals"}
            </CardTitle>
            <CardDescription>
              {canManageWholeOrder
                ? "View payment details"
                : "These totals are calculated from the items visible to your store."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Sub Total: {canManageWholeOrder ? order.sub_total : scopedSubtotal}</p>
            <p>
              Discount: {canManageWholeOrder ? order.discount_total : scopedDiscount}
            </p>
            <p>Tax: {canManageWholeOrder ? order.tax_total : scopedTax}</p>
            {canManageWholeOrder ? (
              <>
                <p>Shipping: {order.shipping_total}</p>
                <p>Method: {order.payment_method}</p>
                <p>Type: {order.payment_status}</p>
                <p>Fee: {order.payment_fee}</p>
              </>
            ) : null}
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
                  <TableCell colSpan={5}>
                    {canManageWholeOrder ? order.sub_total : scopedSubtotal}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-left">Discount</TableCell>
                  <TableCell colSpan={5}>
                    {canManageWholeOrder ? order.discount_total : scopedDiscount}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-left">Tax</TableCell>
                  <TableCell colSpan={5}>
                    {canManageWholeOrder ? order.tax_total : scopedTax}
                  </TableCell>
                </TableRow>
                {canManageWholeOrder ? (
                  <>
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
                  </>
                ) : null}
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
