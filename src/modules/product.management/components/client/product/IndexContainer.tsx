"use client";

import PageContainer from "@/modules/core/components/server/PageContainer";
import usePageAuthentication from "@/modules/core/hooks/usePageAuthentication";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function IndexContainer() {
  usePageAuthentication();
  const router = useRouter();
  const onFilterChangeAction = () => console.log("filter change");
  return (
    <PageContainer pageTitle="Manage Products">
      <Card>
        <CardHeader className="flex justify-between">
          <div>
            <Input
              onChange={onFilterChangeAction}
              placeholder="filter by name"
              className="w-44 focus-visible:ring-primary"
            />
          </div>
          <div>
            <Button onClick={() => router.push("/products/create")}>
              Create Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>N/A</CardContent>
      </Card>
    </PageContainer>
  );
}
