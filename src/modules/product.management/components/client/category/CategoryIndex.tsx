import { Card, CardContent } from "@/components/ui/card";
import DataTable from "@/modules/core/components/client/DataTable";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { actionGetCategories } from "@/modules/product.management/actions/category";

export default function CategoryIndex() {
  return (
    <PageContainer pageTitle="Manage Categories">
      <Card>
        <CardContent>
          <DataTable
            entityKey="categories"
            columns={[
              { label: "Name", accessor: "name" },
              { label: "Slug", accessor: "slug" },
              { label: "Created At", accessor: "created_at" },
            ]}
            fetchAction={actionGetCategories}
            filterOptions={[
              { label: "Root Only", value: "rootOnly" },
              { label: "Leaf Only", value: "leafOnly" },
            ]}
            defaultFilter="rootOnly"
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
