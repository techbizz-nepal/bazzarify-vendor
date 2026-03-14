import { IRoute } from "@/modules/core";

const users: IRoute["user"] = {
  index: {
    path: "/auth/consumers",
  },
  getByKey: {
    path: "/auth/consumers/:uuid",
  },
};

export default users;
