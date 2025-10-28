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
};
export default order;
