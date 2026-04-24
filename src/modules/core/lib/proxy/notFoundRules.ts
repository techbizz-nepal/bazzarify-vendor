import {
  NOT_FOUND_PATH,
  VENDOR_AUTH_PUBLIC_ROUTES,
} from "@/modules/core/lib/proxy/constants";
import {
  isHostUnderSubdomain,
  isPathUnderRoute,
} from "@/modules/core/lib/proxy/helpers";

const notFoundRules = [
  {
    routes: VENDOR_AUTH_PUBLIC_ROUTES,
    subdomain: "admin",
  },
  {
    routes: ["/categories"],
    subdomain: "vendor",
  },
] as const;

export function shouldRedirectToNotFound(
  pathname: string,
  host: string,
): boolean {
  if (pathname === NOT_FOUND_PATH) {
    return false;
  }

  return notFoundRules.some(
    ({ routes, subdomain }) =>
      isPathUnderRoute(pathname, routes) &&
      isHostUnderSubdomain(host, subdomain),
  );
}
