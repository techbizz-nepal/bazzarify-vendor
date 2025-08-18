import { actionGetCategories } from "@/modules/product.management/actions/category";
import Create from "@/modules/product.management/components/client/product/Create";
import { Loader } from "lucide-react";
import { Suspense } from "react";

export default async function Page() {
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
