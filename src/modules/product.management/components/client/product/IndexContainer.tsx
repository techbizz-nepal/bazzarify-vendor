import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DataTable from "@/modules/core/components/client/DataTable";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";
import { actionGetProducts } from "@/modules/product.management/actions/product";
import Link from "next/link";

export default function IndexContainer() {
  return (
    <PageContainer pageTitle="Manage Products">
      <Card>
        <CardHeader className="flex justify-end">
          <Link passHref href="/products/create">
            <ThemedButton>Create Product</ThemedButton>
          </Link>
        </CardHeader>
        <CardContent>
          <DataTable
            entityKey="products"
            columns={[
              { label: "Name", accessor: "name" },
              { label: "Slug", accessor: "slug" },
              { label: "Created At", accessor: "created_at" },
            ]}
            fetchAction={actionGetProducts}
            // filterOptions={[
            //   { label: "Root Only", value: "rootOnly" },
            //   { label: "Leaf Only", value: "leafOnly" },
            // ]}
            // defaultFilter="rootOnly"
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
