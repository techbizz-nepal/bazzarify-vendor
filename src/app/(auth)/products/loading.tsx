import PageContainer from "@/modules/core/components/server/PageContainer";
import ServerDataTableSkeleton from "@/modules/core/components/server/ServerDataTableSkeleton";

export default function ProductsLoading() {
  return (
    <PageContainer pageTitle="Manage Products">
      <ServerDataTableSkeleton title="Manage Products" filterCount={2} />
    </PageContainer>
  );
}
