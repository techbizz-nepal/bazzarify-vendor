"use client";

import PageContainer from "@/modules/core/components/server/PageContainer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";

export default function IndexContainer() {
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
            <ThemedButton onClick={() => router.push("/products/create")}>
              Create Product
            </ThemedButton>
          </div>
        </CardHeader>
        <CardContent>N/A</CardContent>
      </Card>
    </PageContainer>
  );
}
