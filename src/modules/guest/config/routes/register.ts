import { IRoute } from "@/modules/core";

const register: IRoute["register"] = {
  signup: {
    path: "/auth/vendor/register/signup",
  },
  verifySignup: {
    path: "/auth/vendor/register/verify-signup",
  },
};

export default register;
