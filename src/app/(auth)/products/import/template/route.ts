import { getSessionToken } from "@/modules/auth/data/lib/auth-lib";
import { getCookieStore } from "@/modules/core/lib/utils.session";
import { PRODUCT_MANAGEMENT_ROUTES } from "@/modules/product.management/config/routes";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.API_URL || "http://local-ne.larashops.local:8081/api/v1";
const appKey = process.env.APP_KEY || "";

export async function GET(request: NextRequest) {
  const token = await getSessionToken(await getCookieStore());

  if (!token) {
    return NextResponse.redirect(new URL("/login", process.env.APP_URL || "http://localhost:3001"));
  }

  const targetStoreUuid = request.nextUrl.searchParams.get("target_store_uuid");
  const endpoint = new URL(
    `${apiUrl}${PRODUCT_MANAGEMENT_ROUTES.product.importTemplate.path}`,
  );
  if (targetStoreUuid) {
    endpoint.searchParams.set("target_store_uuid", targetStoreUuid);
  }

  try {
    const response = await axios.get<ArrayBuffer>(endpoint.toString(), {
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/csv",
        "X-APP-Key": appKey,
      },
      validateStatus: (status) => status < 500,
    });

    if (response.status >= 400) {
      return NextResponse.json(
        { error: "Unable to download the import template." },
        { status: response.status },
      );
    }

    return new NextResponse(response.data, {
      status: 200,
      headers: {
        "Content-Type":
          response.headers["content-type"] ?? "text/csv; charset=UTF-8",
        "Content-Length": String(response.data.byteLength),
        "Content-Disposition":
          response.headers["content-disposition"] ??
          'attachment; filename="product-import-template.csv"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[product-import-template-proxy]", {
      message: error instanceof Error ? error.message : "Unknown template proxy error",
    });

    return NextResponse.json(
      { error: "Unable to download the import template." },
      { status: 500 },
    );
  }
}
