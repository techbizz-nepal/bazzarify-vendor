import { IRoute } from "@/modules/core";

const category: IRoute["category"] = {
  index: {
    path: "/product-management/categories",
  },
  show: {
    path: "/product-management/categories/:slug",
  },
  update: {
    path: "/product-management/categories/:slug",
  },
};
export default category;
