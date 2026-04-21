import { getSessionToken } from "@/modules/auth/data/lib/auth-lib";
import { getCookieStore } from "@/modules/core/lib/utils.session";
import { PRODUCT_MANAGEMENT_ROUTES } from "@/modules/product.management/config/routes";
import { NextResponse } from "next/server";

const apiUrl = process.env.API_URL || "http://local-ne.larashops.local:8081/api/v1";
const appKey = process.env.APP_KEY || "";
const appUrl = process.env.APP_URL || "http://localhost:3001";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uuid: string }> },
) {
  const { uuid } = await params;
  const token = await getSessionToken(await getCookieStore());

  if (!token) {
    return NextResponse.redirect(new URL("/login", appUrl));
  }

  const endpoint = `${apiUrl}${PRODUCT_MANAGEMENT_ROUTES.product.importErrorReport.path.replace(":uuid", uuid)}`;

  try {
    const upstream = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/csv",
        "X-APP-Key": appKey,
      },
      cache: "no-store",
    });

    if (!upstream.ok || upstream.body === null) {
      return NextResponse.json(
        { error: "Unable to download the error report." },
        { status: upstream.status >= 400 ? upstream.status : 502 },
      );
    }

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") ?? "text/csv; charset=UTF-8",
        "Content-Disposition":
          upstream.headers.get("content-disposition") ??
          `attachment; filename="product-import-${uuid}-errors.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(
      `[product-import-error-report-proxy] ${error instanceof Error ? error.message : "Unknown error-report proxy error"}`,
    );

    return NextResponse.json(
      { error: "Unable to download the error report." },
      { status: 500 },
    );
  }
}
