import { requireVendorStoreGuard } from "@/modules/vendor/domain/requireVendorStoreGuard";
import Index from "@/modules/product.management/components/client/product/Index";

export default async function ProductsPage() {
  await requireVendorStoreGuard("/products");

  return <Index />;
}
