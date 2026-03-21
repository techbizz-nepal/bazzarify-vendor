import ServerDataTable from "@/modules/core/components/client/ServerDataTable";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { flattenSearchParams } from "@/modules/core/utils/searchParams";
import { actionGetCategories } from "@/modules/product.management/actions/category";
import { TCategory } from "@/modules/product.management";
import { TableColumn } from "@/modules/core/components/client/DynamicTable";

const categoryColumns: TableColumn<TCategory>[] = [
  { key: "name", title: "Name" },
  { key: "is_sellable", title: "Sellable" },
  { key: "created_at", title: "Created At" },
  { key: "updated_at", title: "Updated At" },
];

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const flattenedParams = flattenSearchParams(resolvedSearchParams);
  const page = Number(flattenedParams.page ?? "1");

  const categoryResponse = await actionGetCategories({
    ...flattenedParams,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  });

  const categories =
    categoryResponse && typeof categoryResponse === "object" && "categories" in categoryResponse
      ? categoryResponse.categories
      : null;
  const table =
    categoryResponse &&
    typeof categoryResponse === "object" &&
    "table" in categoryResponse
      ? categoryResponse.table
      : null;

  return (
    <PageContainer pageTitle="Manage Categories">
      <ServerDataTable
        title="Manage Categories"
        description="Manage categories with server-driven filters, pagination, and backend-owned query behavior."
        columns={categoryColumns}
        rows={categories?.data ?? []}
        emptyMessage="No categories found for the current filters."
        table={
          table ?? {
            search: {
              queryKey: "filter[name]",
              placeholder: "Search categories by name...",
            },
            filters: [],
          }
        }
        initialFilters={Object.fromEntries(
          Object.entries(flattenedParams).filter(([key]) => key !== "page"),
        )}
        pagination={{
          currentPage: Number(categories?.current_page ?? 1),
          perPage: categories?.per_page ? Number(categories.per_page) : null,
          from: categories?.from ?? null,
          to: categories?.to ?? null,
          hasNextPage: Boolean(categories?.next_page_url),
          hasPreviousPage: Boolean(categories?.prev_page_url),
        }}
        rowActions={[
          {
            label: "Manage Schema",
            hrefTemplate: "/categories/:slug/view",
          },
        ]}
      />
    </PageContainer>
  );
}
