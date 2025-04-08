import { IRoute } from "@/modules/core";
import category from "@/modules/product.management/config/routes/category";
import product from "@/modules/product.management/config/routes/product";
import attribute from "@/modules/product.management/config/routes/attribute";
import specification from "@/modules/product.management/config/routes/specification";

export const PRODUCT_MANAGEMENT_ROUTES: IRoute = {
  category,
  product,
  attribute,
  specification,
};
