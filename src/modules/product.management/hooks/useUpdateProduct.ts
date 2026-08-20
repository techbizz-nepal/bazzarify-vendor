import { TEditProductPayload } from "@/modules/product.management";
import useProductAuthoring from "@/modules/product.management/hooks/useProductAuthoring";

export default function useUpdateProduct(
  editProductPayload: TEditProductPayload,
) {
  return useProductAuthoring({
    mode: "update",
    editProductPayload,
  });
}
