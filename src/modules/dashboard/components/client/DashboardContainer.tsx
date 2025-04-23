import { Card } from "@/components/ui/card";
import PageContainer from "@/modules/core/components/server/PageContainer";

export default function DashboardContainer() {
  return (
    <PageContainer pageTitle={"Dashboard"}>
      <Statistics />
    </PageContainer>
  );
}

const Statistics = () => (
  <Card className="px-4 items-center justify-center" id="stats">
    <p>Welcome to dashboard.</p>
  </Card>
);
