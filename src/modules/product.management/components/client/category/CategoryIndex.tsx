"use client";

import PageContainer from "@/modules/core/components/server/PageContainer";
import usePageAuthentication from "@/modules/core/hooks/usePageAuthentication";
import useDataTable from "@/modules/core/hooks/useDataTable";
import { TCategory } from "@/modules/product.management";
import { actionGetCategories } from "@/modules/product.management/actions";
import CategoryDataTable from "@/modules/product.management/components/client/category/CategoryDataTable";
import { useRouter } from "next/navigation";
import React from "react";

export default function CategoryIndex() {
  usePageAuthentication();
  const router = useRouter();

  const {
    page,
    rows,
    handlePreviousPage,
    handleNextPage,
    rowsCount,
    handleFilterChange,
    handleOnlyLastChildrenFilter,
  } = useDataTable<TCategory, { categories: TCategory[] }>(
    actionGetCategories,
    "categories",
  );
  const handleViewAction = (slug: string) =>
    router.push("/categories/".concat(slug).concat("/view"));
  const handleEditAction = (slug: string) =>
    router.push("/categories/".concat(slug).concat("/edit"));

  return (
    <PageContainer pageTitle="Manage Categories">
      <CategoryDataTable
        page={page}
        rowsCount={rowsCount}
        data={rows}
        onPreviousAction={handlePreviousPage}
        onNextAction={handleNextPage}
        onEditAction={handleEditAction}
        onViewAction={handleViewAction}
        onFilterChangeAction={handleFilterChange}
        onOnlyLastChildrenAction={handleOnlyLastChildrenFilter}
      />
    </PageContainer>
  );
}
