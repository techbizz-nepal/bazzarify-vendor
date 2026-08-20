import PageContainer from "@/modules/core/components/server/PageContainer";
import ServerDataTableSkeleton from "@/modules/core/components/server/ServerDataTableSkeleton";

export default function CategoriesLoading() {
  return (
    <PageContainer pageTitle="Manage Categories">
      <ServerDataTableSkeleton title="Manage Categories" filterCount={3} />
    </PageContainer>
  );
}
