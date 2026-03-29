import { getSessionToken } from "@/modules/auth/data/lib/auth-lib";
import { getCookieStore } from "@/modules/core/lib/utils.session";
import { PRODUCT_MANAGEMENT_ROUTES } from "@/modules/product.management/config/routes";
import axios from "axios";
import { NextResponse } from "next/server";

const apiUrl = process.env.API_URL || "http://local-ne.larashops.local:8081/api/v1";
const appKey = process.env.APP_KEY || "";

export async function GET() {
  const token = await getSessionToken(await getCookieStore());

  if (!token) {
    return NextResponse.redirect(new URL("/login", process.env.APP_URL || "http://localhost:3001"));
  }

  const endpoint = `${apiUrl}${PRODUCT_MANAGEMENT_ROUTES.product.importTemplate.path}`;

  try {
    const response = await axios.get<ArrayBuffer>(endpoint, {
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
        "Content-Disposition":
          response.headers["content-disposition"] ??
          'attachment; filename="product-import-template.csv"',
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
