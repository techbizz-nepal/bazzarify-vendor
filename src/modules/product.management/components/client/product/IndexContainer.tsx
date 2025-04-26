"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";
import { useRouter } from "next/navigation";

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
              className="focus-visible:ring-primary w-44"
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
