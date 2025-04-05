import { IRoute } from "@/modules/core";

export const PRODUCT_MANAGEMENT_ROUTES: IRoute = {
  getCategories: {
    name: "categories",
    path: "/product-management/categories",
  },
  viewCategory: {
    name: "view.category",
    path: "/product-management/categories/:slug",
  },
  updateCategory: {
    name: "view.category",
    path: "/product-management/categories/:slug",
  },
  getProducts: {
    name: "products",
    path: "/product-management/products",
  },
  getAttributes: {
    name: "products",
    path: "/product-management/attributes",
  },
  addCategoryAttribute: {
    name: "add-attribute",
    path: "/product-management/attributes",
    method: "POST",
  },
};
