import { Card, CardContent } from "@/components/ui/card";
import DataTable from "@/modules/core/components/client/DataTable";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { actionGetUsers } from "@/modules/product.management/actions/user";

export default function Index() {
  return (
    <PageContainer pageTitle="Manage Products">
      <Card>
        <CardContent>
          <DataTable
            entityKey="users"
            columns={[
              { label: "Name", accessor: "name" },
              { label: "Email", accessor: "email" },
              { label: "Phone", accessor: "phone" },
              { label: "Created At", accessor: "created_at" },
              { label: "Updated At", accessor: "updated_at" },
            ]}
            fetchAction={actionGetUsers}
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
