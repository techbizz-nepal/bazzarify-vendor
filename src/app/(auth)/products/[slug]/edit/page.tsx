import { IPageParams } from "@/modules/core";
import { actionGetCategories } from "@/modules/product.management/actions/category";
import { actionEditProduct } from "@/modules/product.management/actions/product";
import Edit from "@/modules/product.management/components/client/product/Edit";
import { Loader } from "lucide-react";
import { Suspense } from "react";

export default async function Page({ params }: IPageParams) {
  const { slug } = await params;
  const productPayloadPromise = actionEditProduct(slug);
  const categoryIndexPayloadPromise = actionGetCategories({
    filter: { rootOnly: true },
    sort: "name",
  });

  return (
    <Suspense fallback={<Loader />}>
      <Edit
        productPayloadPromise={productPayloadPromise}
        categoryIndexPayloadPromise={categoryIndexPayloadPromise}
      />
    </Suspense>
  );
}
