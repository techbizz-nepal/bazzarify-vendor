import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DataTable from "@/modules/core/components/client/DataTable";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { actionGetProducts } from "@/modules/product.management/actions/product";

export default function Index() {
  return (
    <PageContainer pageTitle="Manage Products">
      <Card>
        <CardHeader className="flex justify-end" />
        <CardContent>
          <DataTable
            entityKey="products"
            columns={[
              { label: "Category", accessor: "categories.name" },
              { label: "Name", accessor: "name" },
              { label: "Created By", accessor: "user.name" },
              { label: "Status", accessor: "status_text" },
              { label: "Created At", accessor: "created_at" },
              { label: "Updated At", accessor: "updated_at" },
            ]}
            fetchAction={actionGetProducts}
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
