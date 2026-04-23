import BackLinkButton from "@/modules/core/components/server/BackLinkButton";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { actionGetAttributes } from "@/modules/product.management/actions/attribute";
import { actionGetCategories } from "@/modules/product.management/actions/category";
import { actionGetSpecifications } from "@/modules/product.management/actions/specification";
import Create from "@/modules/product.management/components/client/category/Create";

export default async function CreateCategoryPage() {
  const [categoryResponse, attributeResponse, specificationResponse] =
    await Promise.all([
      actionGetCategories({
        perPage: "200",
        filter: { rootOnly: true },
      }),
      actionGetAttributes({ perPage: "200" }),
      actionGetSpecifications({ perPage: "200" }),
    ]);

  const categories =
    categoryResponse &&
    typeof categoryResponse === "object" &&
    "categories" in categoryResponse
      ? categoryResponse.categories.data
      : [];
  const attributes =
    attributeResponse &&
    typeof attributeResponse === "object" &&
    "attributes" in attributeResponse
      ? attributeResponse.attributes.data
      : [];
  const specifications =
    specificationResponse?.data?.payload?.specifications?.data ?? [];

  return (
    <PageContainer
      pageTitle="Create Category"
      actionSlot={
        <BackLinkButton href="/categories" label="Back to Categories" />
      }
    >
      <Create
        categories={categories}
        attributes={attributes}
        specifications={specifications}
      />
    </PageContainer>
  );
}
