import PageContainer from "@/modules/core/components/server/PageContainer";
import CreateContainer from "@/modules/product.management/components/client/product/CreateContainer";

export default function Page() {
  return (
    <PageContainer pageTitle="Create Products">
      <CreateContainer />
    </PageContainer>
  );
}
