import ErrorComponent from "@/modules/core/components/client/ErrorComponent";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { flattenSearchParams } from "@/modules/core/utils/searchParams";
import { getAuthUser, getSessionUserUUID } from "@/modules/auth/data/lib/auth-lib";
import { getCookieStore } from "@/modules/core/lib/utils.session";
import { TServerDataTableMeta } from "@/modules/core/domain/schemas/ServerDataTableMeta";
import ProductImportsServerTable from "@/modules/product.management/components/client/product-import/ProductImportsServerTable";
import { actionGetProductImports } from "@/modules/product.management/actions/import";

export default async function ProductImportsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const flattenedParams = flattenSearchParams(resolvedSearchParams);
  const page = Number(flattenedParams.page ?? "1");

  const normalizedPage = Number.isFinite(page) && page > 0 ? page : 1;
  const response = await actionGetProductImports({
    ...flattenedParams,
    page: String(normalizedPage),
  });

  if (response && typeof response === "object" && "error" in response) {
    return (
      <PageContainer pageTitle="Product Imports">
        <ErrorComponent err={response.error} />
      </PageContainer>
    );
  }

  const userUuid = await getSessionUserUUID(await getCookieStore());
  const authUser = userUuid ? await getAuthUser(userUuid) : null;
  const canManageAcrossStores = Boolean(
    authUser &&
      !("error" in authUser) &&
      authUser.roles.some(
        (role) => role.name === "super-admin" || role.name === "admin",
      ),
  );

  const imports = response.imports;

  return (
    <PageContainer pageTitle="Product Imports">
      <ProductImportsServerTable
        rows={imports.data}
        table={response.table as unknown as TServerDataTableMeta}
        initialFilters={Object.fromEntries(
          Object.entries(flattenedParams).filter(([key]) => key !== "page"),
        )}
        pagination={{
          currentPage: Number(imports.current_page ?? 1),
          perPage: imports.per_page ? Number(imports.per_page) : null,
          from: imports.from ?? null,
          to: imports.to ?? null,
          hasNextPage: Boolean(imports.next_page_url),
          hasPreviousPage: Boolean(imports.prev_page_url),
        }}
        canManageAcrossStores={canManageAcrossStores}
      />
    </PageContainer>
  );
}
