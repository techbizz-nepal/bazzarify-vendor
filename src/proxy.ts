import { shouldRedirectToNotFound } from "@/modules/core/lib/proxy/notFoundRules";
import { redirectToNotFound } from "@/modules/core/lib/proxy/redirects";
import { getRequestHostname } from "@/modules/core/lib/utils.requestHost";
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const host = getRequestHostname(request.headers);
  const pathname = request.nextUrl.pathname;

  if (shouldRedirectToNotFound(pathname, host)) {
    return redirectToNotFound(request.url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
