import PageContainer from "@/modules/core/components/server/PageContainer";
import ServerDataTableSkeleton from "@/modules/core/components/server/ServerDataTableSkeleton";

export default function OrdersLoading() {
  return (
    <PageContainer pageTitle="Manage Orders">
      <ServerDataTableSkeleton title="Manage Orders" filterCount={4} />
    </PageContainer>
  );
}
