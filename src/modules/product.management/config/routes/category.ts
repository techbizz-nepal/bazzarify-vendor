import { IRoute } from "@/modules/core";

const category: IRoute["category"] = {
  index: {
    path: "/product-management/categories/assigned",
  },
  create: {
    path: "/product-management/categories",
    method: "POST",
  },
  show: {
    path: "/product-management/categories/:slug",
  },
  showSpecifications: {
    path: "/product-management/categories/:slug/specifications",
  },
  update: {
    path: "/product-management/categories/:slug",
  },
  icon: {
    path: "/product-management/categories/:slug/icon",
    method: "POST",
  },
  viewParentRecursive: {
    path: "/product-management/categories/:slug/view-parent-recursive",
  },
};
export default category;
