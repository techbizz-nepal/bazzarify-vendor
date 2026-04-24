import { NOT_FOUND_PATH } from "@/modules/core/lib/proxy/constants";
import { buildRequestUrl } from "@/modules/core/lib/utils.requestUrl";
import { NextResponse } from "next/server";

export function redirectToNotFound(requestUrl: string) {
  return NextResponse.redirect(
    buildRequestUrl(requestUrl, NOT_FOUND_PATH),
    302,
  );
}
