import { IRoute } from "@/modules/core";

const users: IRoute["user"] = {
  index: {
    path: "/auth/users",
  },
  getByKey: {
    path: "/auth/users/:uuid",
  },
};

export default users;
