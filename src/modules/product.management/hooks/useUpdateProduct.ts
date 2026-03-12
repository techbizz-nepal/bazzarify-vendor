import { IMetaData } from "@/modules/core";
import { TEditProductPayload } from "@/modules/product.management";
import useProductAuthoring from "@/modules/product.management/hooks/useProductAuthoring";

export default function useUpdateProduct(
  productPayloadPromise: Promise<TEditProductPayload | IMetaData>,
) {
  return useProductAuthoring({
    mode: "update",
    productPayloadPromise,
  });
}
