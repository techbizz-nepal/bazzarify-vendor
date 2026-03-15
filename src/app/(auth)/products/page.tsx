import { Button } from "@/components/ui/button";
import { TableColumn } from "@/modules/core/components/client/DynamicTable";
import ServerDataTable from "@/modules/core/components/client/ServerDataTable";
import { FilterDefinition } from "@/modules/core/components/client/TableFilterToolbar";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { actionGetProducts } from "@/modules/product.management/actions/product";
import { TProduct } from "@/modules/product.management";
import { ProductStatus } from "@/modules/product.management/config/enums/ProductStatus";
import { requireVendorStoreGuard } from "@/modules/vendor/domain/requireVendorStoreGuard";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

const productColumns: TableColumn<TProduct>[] = [
  {
    key: "categories.name",
    title: "Category",
  },
  {
    key: "name",
    title: "Name",
  },
  {
    key: "sku",
    title: "SKU",
  },
  {
    key: "user.name",
    title: "Created By",
  },
  {
    key: "status_text",
    title: "Status",
  },
  {
    key: "created_at",
    title: "Created At",
  },
  {
    key: "updated_at",
    title: "Updated At",
  },
];

const productFilterDefinitions: FilterDefinition[] = [
  {
    type: "text",
    key: "sku",
    label: "SKU",
    placeholder: "Filter by SKU...",
  },
  {
    type: "select",
    key: "status",
    label: "Status",
    options: Object.entries(ProductStatus).map(([label, value]) => ({
      label,
      value: String(value),
    })),
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

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string | string[];
    page?: string | string[];
    sku?: string | string[];
    status?: string | string[];
  }>;
}) {
  await requireVendorStoreGuard("/products");

  const resolvedSearchParams = await searchParams;
  const search = normalizeSingleValue(resolvedSearchParams.search) ?? "";
  const page = Number(normalizeSingleValue(resolvedSearchParams.page) ?? "1");
  const sku = normalizeSingleValue(resolvedSearchParams.sku) ?? "";
  const status = normalizeSingleValue(resolvedSearchParams.status) ?? "";

  const productResponse = await actionGetProducts({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    filter: {
      ...(search ? { name: search } : {}),
      ...(sku ? { sku } : {}),
      ...(status ? { status } : {}),
    },
  });

  const products =
    productResponse &&
    typeof productResponse === "object" &&
    "categories" in productResponse
      ? productResponse.categories
      : null;

  return (
    <PageContainer pageTitle="Manage Products">
      <ServerDataTable
        title="Manage Products"
        description="Manage products with server-driven filters, pagination, and backend-owned query behavior."
        toolbarAction={
          <Button asChild size="sm">
            <Link href="/products/create">
              <FaPlus className="mr-2" />
              New Product
            </Link>
          </Button>
        }
        columns={productColumns}
        rows={products?.data ?? []}
        emptyMessage="No products found for the current filters."
        search={{
          queryKey: "search",
          value: search,
          placeholder: "Search products by name...",
        }}
        filters={productFilterDefinitions}
        initialFilters={{
          search,
          ...(sku ? { sku } : {}),
          ...(status ? { status } : {}),
        }}
        pagination={{
          currentPage: Number(products?.current_page ?? 1),
          perPage: products?.per_page ? Number(products.per_page) : null,
          from: products?.from ?? null,
          to: products?.to ?? null,
          hasNextPage: Boolean(products?.next_page_url),
          hasPreviousPage: Boolean(products?.prev_page_url),
        }}
        rowActions={[
          { label: "View", hrefTemplate: "/products/:uuid", variant: "outline" },
          {
            label: "Edit",
            hrefTemplate: "/products/:uuid/edit",
            variant: "outline",
          },
        ]}
      />
    </PageContainer>
  );
}
