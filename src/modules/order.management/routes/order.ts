import { IRoute } from "@/modules/core";

const order: IRoute["order"] = {
  index: {
    path: "/order-management/orders",
  },
  show: {
    path: "/order-management/orders/:orderId",
  },
  update: {
    path: "/order-management/orders/:orderId",
  },
  itemFulfillment: {
    path: "/order-management/orders/:orderId/items/:itemId/fulfillment",
  },
  statuses: {
    path: "/order-management/orders/statuses",
  },
};
export default order;
