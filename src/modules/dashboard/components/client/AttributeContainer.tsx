"use client";

import PageContainer from "@/modules/core/components/server/PageContainer";
import usePageAuthentication from "@/modules/core/hooks/usePageAuthentication";
import useDataTable from "@/modules/core/hooks/useDataTable";
import { TAttribute } from "@/modules/product.management";
import { actionGetAttributes } from "@/modules/product.management/actions";
import CategoryDataTable from "@/modules/product.management/components/client/category/CategoryDataTable";
import { usePathname, useRouter } from "next/navigation";

export default function AttributeContainer() {
  usePageAuthentication();
  const router = useRouter();
  const pathname = usePathname();
  const { page, rows, handlePreviousPage, handleNextPage, rowsCount } =
    useDataTable<TAttribute, { attributes: TAttribute[] }>(
      actionGetAttributes,
      "attributes",
      { perPage: 15, with: ["specifications"] },
    );
  const handleAddClick = () => router.push(pathname.concat("/new"));
  return (
    <PageContainer
      pageTitle="Manage Category Attributes"
      onAddClick={handleAddClick}
    >
      <CategoryDataTable
        page={page}
        rowsCount={rowsCount}
        data={rows}
        onPreviousAction={handlePreviousPage}
        onNextAction={handleNextPage}
      />
    </PageContainer>
  );
}
