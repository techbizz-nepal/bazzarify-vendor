import useProductAuthoring from "@/modules/product.management/hooks/useProductAuthoring";

export default function useCreateProduct() {
  return useProductAuthoring({ mode: "create" });
}
