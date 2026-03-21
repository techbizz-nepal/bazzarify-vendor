import { IPageParams } from "@/modules/core";
import { actionGetCategories } from "@/modules/product.management/actions/category";
import { actionEditProduct } from "@/modules/product.management/actions/product";
import Edit from "@/modules/product.management/components/client/product/Edit";
import { requireVendorStoreGuard } from "@/modules/vendor/domain/requireVendorStoreGuard";

export default async function Page({ params }: IPageParams) {
  const { uuid } = await params;
  await requireVendorStoreGuard(`/products/${uuid}/edit`);
  const [productPayload, categoryIndexPayload] = await Promise.all([
    actionEditProduct(uuid),
    actionGetCategories({
      filter: { rootOnly: true },
      sort: "name",
    }),
  ]);

  return (
    <Edit
      productPayload={productPayload}
      categoryIndexPayload={categoryIndexPayload}
    />
  );
}
