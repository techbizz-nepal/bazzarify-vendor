import { actionGetCategories } from "@/modules/product.management/actions/category";
import Create from "@/modules/product.management/components/client/product/Create";
import { requireVendorStoreGuard } from "@/modules/vendor/domain/requireVendorStoreGuard";
import { Loader } from "lucide-react";
import { Suspense } from "react";

export default async function Page() {
  await requireVendorStoreGuard("/products/create");

  const categoryIndexPayloadPromise = actionGetCategories({
    filter: { rootOnly: true },
    sort: "name",
  });

  return (
    <Suspense fallback={<Loader />}>
      <Create categoryIndexPayloadPromise={categoryIndexPayloadPromise} />
    </Suspense>
  );
}
