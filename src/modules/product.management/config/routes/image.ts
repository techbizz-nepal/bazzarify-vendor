import { IRoute } from "@/modules/core";

const image: IRoute["image"] = {
  delete: {
    path: "/product-management/images/:uuid",
  },
};

export default image;
