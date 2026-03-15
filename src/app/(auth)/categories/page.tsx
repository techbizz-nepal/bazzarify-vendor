import ServerDataTable from "@/modules/core/components/client/ServerDataTable";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { actionGetCategories } from "@/modules/product.management/actions/category";
import { TCategory } from "@/modules/product.management";
import { FilterDefinition } from "@/modules/core/components/client/TableFilterToolbar";
import { TableColumn } from "@/modules/core/components/client/DynamicTable";

const categoryColumns: TableColumn<TCategory>[] = [
  { key: "name", title: "Name" },
  { key: "created_at", title: "Created At" },
  { key: "updated_at", title: "Updated At" },
];

const categoryFilterDefinitions: FilterDefinition[] = [
  {
    type: "select",
    key: "rootOnly",
    label: "Category scope",
    options: [{ label: "Root only", value: "true" }],
  },
  {
    type: "select",
    key: "leafOnly",
    label: "Leaf scope",
    options: [{ label: "Leaf only", value: "true" }],
  },
  {
    type: "select",
    key: "trashed",
    label: "Trash state",
    options: [{ label: "Only trashed", value: "only" }],
  },
];

const normalizeSingleValue = (
  value: string | string[] | undefined,
): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string | string[];
    page?: string | string[];
    rootOnly?: string | string[];
    leafOnly?: string | string[];
    trashed?: string | string[];
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = normalizeSingleValue(resolvedSearchParams.search) ?? "";
  const page = Number(normalizeSingleValue(resolvedSearchParams.page) ?? "1");
  const rootOnly = normalizeSingleValue(resolvedSearchParams.rootOnly) ?? "";
  const leafOnly = normalizeSingleValue(resolvedSearchParams.leafOnly) ?? "";
  const trashed = normalizeSingleValue(resolvedSearchParams.trashed) ?? "";

  const categoryResponse = await actionGetCategories({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    filter: {
      ...(search ? { name: search } : {}),
      ...(rootOnly ? { rootOnly } : {}),
      ...(leafOnly ? { leafOnly } : {}),
      ...(trashed ? { trashed } : {}),
    },
  });

  const categories =
    categoryResponse && typeof categoryResponse === "object" && "categories" in categoryResponse
      ? categoryResponse.categories
      : null;

  return (
    <PageContainer pageTitle="Manage Categories">
      <ServerDataTable
        title="Manage Categories"
        description="Manage categories with server-driven filters, pagination, and backend-owned query behavior."
        columns={categoryColumns}
        rows={categories?.data ?? []}
        emptyMessage="No categories found for the current filters."
        search={{
          queryKey: "search",
          value: search,
          placeholder: "Search categories by name...",
        }}
        filters={categoryFilterDefinitions}
        initialFilters={{
          search,
          ...(rootOnly ? { rootOnly } : {}),
          ...(leafOnly ? { leafOnly } : {}),
          ...(trashed ? { trashed } : {}),
        }}
        pagination={{
          currentPage: Number(categories?.current_page ?? 1),
          perPage: categories?.per_page ? Number(categories.per_page) : null,
          from: categories?.from ?? null,
          to: categories?.to ?? null,
          hasNextPage: Boolean(categories?.next_page_url),
          hasPreviousPage: Boolean(categories?.prev_page_url),
        }}
      />
    </PageContainer>
  );
}
