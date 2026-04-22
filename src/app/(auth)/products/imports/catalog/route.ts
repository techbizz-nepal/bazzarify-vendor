import { getSessionToken } from "@/modules/auth/data/lib/auth-lib";
import { getCookieStore } from "@/modules/core/lib/utils.session";
import { PRODUCT_MANAGEMENT_ROUTES } from "@/modules/product.management/config/routes";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const apiUrl = process.env.API_URL || "http://local-ne.larashops.local:8081/api/v1";
const appKey = process.env.APP_KEY || "";
const appUrl = process.env.APP_URL || "http://localhost:3001";

export async function GET(request: NextRequest) {
  const token = await getSessionToken(await getCookieStore());

  if (!token) {
    return NextResponse.redirect(new URL("/login", appUrl));
  }

  const targetStoreUuid = request.nextUrl.searchParams.get("target_store_uuid");
  const query =
    targetStoreUuid !== null && targetStoreUuid !== ""
      ? `?target_store_uuid=${encodeURIComponent(targetStoreUuid)}`
      : "";
  const endpoint = `${apiUrl}${PRODUCT_MANAGEMENT_ROUTES.product.importCatalog.path}${query}`;

  try {
    const upstream = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/zip",
        "X-APP-Key": appKey,
      },
      cache: "no-store",
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Unable to download the product import catalog." },
        { status: upstream.status >= 400 ? upstream.status : 502 },
      );
    }

    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") ?? "application/zip",
        "Content-Length": String(buffer.byteLength),
        "Content-Disposition":
          upstream.headers.get("content-disposition") ??
          `attachment; filename="product-import-catalog.zip"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(
      `[product-import-catalog-proxy] ${error instanceof Error ? error.message : "Unknown catalog proxy error"}`,
    );

    return NextResponse.json(
      { error: "Unable to download the product import catalog." },
      { status: 500 },
    );
  }
}
