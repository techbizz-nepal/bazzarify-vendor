import { IRoute } from "@/modules/core";

const product: IRoute["product"] = {
  index: {
    path: "/product-management/products",
  },
  show: {
    path: "/product-management/products/:uuid",
  },
  edit: {
    path: "/product-management/products/:uuid/edit",
  },
  store: {
    path: "/product-management/products",
  },
  update: {
    path: "/product-management/products/:uuid",
  },
};

export default product;
