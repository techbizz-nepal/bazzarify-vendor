"use client";

import PageContainer from "@/modules/core/components/server/PageContainer";
import useDataTable from "@/modules/core/hooks/useDataTable";
import { TCategory } from "@/modules/product.management";
import { actionGetCategories } from "@/modules/product.management/actions/category";
import CategoryDataTable from "@/modules/product.management/components/client/category/CategoryDataTable";
import React from "react";

export default function CategoryIndex() {
  const {
    page,
    rows,
    handlePreviousPage,
    handleNextPage,
    rowsCount,
    handleFilterChange,
    handleOnlyLastChildrenFilter,
    handleViewAction,
    handleEditAction,
  } = useDataTable<TCategory, { categories: TCategory[] }>(
    actionGetCategories,
    "categories",
  );
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
