import { getRequestHostname } from "@/modules/core/lib/utils.requestHost";
import {
  isAdminHost,
  isVendorHost,
  redirectToNotFound,
} from "@/modules/core/lib/utils.requestProxy";
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const host = getRequestHostname(request.headers);
  const pathname = request.nextUrl.pathname;
  const isCategoriesRoute = pathname.startsWith("/categories");

  if (isCategoriesRoute && isVendorHost(host)) {
    return redirectToNotFound(request.url);
  }

  if (isAdminHost(host)) {
    return redirectToNotFound(request.url);
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/register",
    "/reset-password",
    "/verify-otp",
    "/categories/:path*",
  ],
};
