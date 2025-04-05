import PageContainer from "@/modules/core/components/server/PageContainer";
import { Card, CardContent } from "@/components/ui/card";

export default function Page() {
  return (
    <PageContainer pageTitle="Add Category Attribute">
      <Card>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}></form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
