import { actionGetCategories } from "@/modules/product.management/actions/category";
import Create from "@/modules/product.management/components/client/product/Create";
import { requireVendorStoreGuard } from "@/modules/vendor/domain/requireVendorStoreGuard";

export default async function Page() {
  await requireVendorStoreGuard("/products/create");

  const categoryIndexPayload = await actionGetCategories({
    filter: { rootOnly: true },
    sort: "name",
  });

  return <Create categoryIndexPayload={categoryIndexPayload} />;
}
