import { IRoute } from "@/modules/core";
import order from "@/modules/order.management/routes/order";

export const ORDER_MANAGEMENT_ROUTES: Pick<IRoute, "order"> = {
  order,
};
