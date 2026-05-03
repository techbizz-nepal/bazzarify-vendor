import { IRoute } from "@/modules/core";

const users: IRoute["user"] = {
  index: {
    path: "/auth/users",
  },
  getByKey: {
    path: "auth/admin/users/:uuid",
  },
  updateRole: {
    path: "auth/admin/users/:uuid/role",
    method: "PATCH",
  },
};

export default users;
