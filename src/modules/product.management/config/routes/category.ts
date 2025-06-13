import { IRoute } from "@/modules/core";

const category: IRoute["category"] = {
  index: {
    path: "/product-management/categories",
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
  viewParentRecursive: {
    path: "/product-management/categories/:slug/view-parent-recursive",
  },
};
export default category;
