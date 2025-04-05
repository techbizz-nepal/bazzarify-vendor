"use client";

import PageContainer from "@/modules/core/components/server/PageContainer";
import usePageAuthentication from "@/modules/core/hooks/usePageAuthentication";
import useDataTable from "@/modules/core/hooks/useDataTable";
import { TCategory, TProducts } from "@/modules/product.management";
import { actionGetProducts } from "@/modules/product.management/actions";
import CategoryDataTable from "@/modules/product.management/components/client/category/CategoryDataTable";

export default function ProductContainer() {
  usePageAuthentication();
  const { page, rows, handlePreviousPage, handleNextPage, rowsCount } =
    useDataTable<TCategory, { products: TProducts[] }>(
      actionGetProducts,
      "products",
      { perPage: 15 },
    );
  return (
    <PageContainer pageTitle="Manage Products">
      <CategoryDataTable
        page={page}
        data={rows}
        onNextAction={handleNextPage}
        onPreviousAction={handlePreviousPage}
        rowsCount={rowsCount}
      />
    </PageContainer>
  );
}
