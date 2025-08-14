import { IRoute } from "@/modules/core";
import attribute from "@/modules/product.management/config/routes/attribute";
import category from "@/modules/product.management/config/routes/category";
import image from "@/modules/product.management/config/routes/image";
import product from "@/modules/product.management/config/routes/product";
import specification from "@/modules/product.management/config/routes/specification";
import user from "@/modules/product.management/config/routes/user";
import variant from "@/modules/product.management/config/routes/variant";

export const PRODUCT_MANAGEMENT_ROUTES: Pick<
  IRoute,
  | "category"
  | "product"
  | "variant"
  | "attribute"
  | "image"
  | "specification"
  | "user"
> = {
  category,
  product,
  variant,
  image,
  attribute,
  specification,
  user,
};
