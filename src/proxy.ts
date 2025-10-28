import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") || "";

  if (host.startsWith("admin.")) {
    const url = request.nextUrl.clone();
    url.pathname = `/not-found`;
    return NextResponse.redirect(url, 302);
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/register", "/reset-password", "/verify-otp"],
};
