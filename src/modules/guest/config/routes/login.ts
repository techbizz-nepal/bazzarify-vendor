import { IRoute } from "@/modules/core";

const login: IRoute["login"] = {
  loginCredentials: {
    path: "/auth/vendor/login/credentials",
  },
  passwordResetRequest: {
    path: "/auth/password/reset/request",
  },
  passwordReset: {
    path: "/auth/password/reset",
  },
};

export default login;
