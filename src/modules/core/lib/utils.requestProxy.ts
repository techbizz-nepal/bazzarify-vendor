import { buildRequestUrl } from "@/modules/core/lib/utils.requestUrl";
import { NextResponse } from "next/server";

export function isVendorHost(host: string): boolean {
  return host.startsWith("vendor.");
}

export function isAdminHost(host: string): boolean {
  return host.startsWith("admin.");
}

export function redirectToNotFound(requestUrl: string) {
  return NextResponse.redirect(buildRequestUrl(requestUrl, "/not-found"), 302);
}
