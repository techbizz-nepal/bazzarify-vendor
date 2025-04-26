import { IRoute } from "@/modules/core";
import login from "@/modules/guest/config/routes/login";
import register from "@/modules/guest/config/routes/register";
import reset from "@/modules/guest/config/routes/reset";

export const AUTH_ROUTES: Pick<IRoute, "login" | "register" | "reset"> = {
  login,
  register,
  reset,
};
