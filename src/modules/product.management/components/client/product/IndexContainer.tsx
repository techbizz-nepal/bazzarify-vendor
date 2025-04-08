"use client";

import PageContainer from "@/modules/core/components/server/PageContainer";
import usePageAuthentication from "@/modules/core/hooks/usePageAuthentication";
import { Card } from "@/components/ui/card";

export default function IndexContainer() {
  usePageAuthentication();

  return (
    <PageContainer pageTitle="Manage Products">
      <Card>Product</Card>
    </PageContainer>
  );
}
