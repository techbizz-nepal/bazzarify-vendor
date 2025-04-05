"use client";

import PageContainer from "@/modules/core/components/server/PageContainer";
import usePageAuthentication from "@/modules/core/hooks/usePageAuthentication";

export default function ProductContainer() {
  usePageAuthentication();

  return <PageContainer pageTitle="Manage Products">Product</PageContainer>;
}
