import { IRoute } from "@/modules/core";
import attribute from "@/modules/product.management/config/routes/attribute";
import category from "@/modules/product.management/config/routes/category";
import product from "@/modules/product.management/config/routes/product";
import specification from "@/modules/product.management/config/routes/specification";

export const PRODUCT_MANAGEMENT_ROUTES: Pick<
  IRoute,
  "category" | "product" | "attribute" | "specification"
> = {
  category,
  product,
  attribute,
  specification,
};
