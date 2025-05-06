import { Card, CardContent } from "@/components/ui/card";
import DataTable from "@/modules/core/components/client/DataTable";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { actionGetCategories } from "@/modules/product.management/actions/category";

export default function Index() {
  return (
    <PageContainer pageTitle="Manage Categories">
      <Card>
        <CardContent>
          <DataTable
            entityKey="categories"
            columns={[
              { label: "Name", accessor: "name" },
              { label: "Created At", accessor: "created_at" },
              { label: "Updated At", accessor: "updated_at" },
            ]}
            fetchAction={actionGetCategories}
            filterOptions={[
              { label: "Root Only", value: "true", key: "rootOnly" },
              { label: "Leaf Only", value: "true", key: "leafOnly" },
              { label: "Trashed", value: "only", key: "trashed" },
            ]}
            defaultFilter="rootOnly"
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
