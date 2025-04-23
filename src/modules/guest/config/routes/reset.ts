import { IRoute } from "@/modules/core";

const reset: IRoute["reset"] = {
  requestPasswordReset: {
    path: "/auth/password/reset/request",
  },
  verifyResetPassword: {
    path: "/auth/password/reset",
  },
};

export default reset;
