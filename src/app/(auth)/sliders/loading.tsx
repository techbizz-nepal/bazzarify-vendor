import PageContainer from "@/modules/core/components/server/PageContainer";
import ServerDataTableSkeleton from "@/modules/core/components/server/ServerDataTableSkeleton";

export default function SlidersLoading() {
  return (
    <PageContainer pageTitle="Manage Sliders">
      <ServerDataTableSkeleton title="Manage Sliders" filterCount={2} />
    </PageContainer>
  );
}
