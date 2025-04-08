import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import CategoryDropdown from "@/modules/product.management/ui/CategoryDropdown";
import PageContainer from "@/modules/core/components/server/PageContainer";

export default function CreateContainer() {
  return (
    <PageContainer pageTitle="Create Products">
      <Card>
        <CardHeader>
          <p className="text-lg font-semibold">Basic Information</p>
        </CardHeader>
        <CardContent className="flex-row space-y-7">
          <div className="grid w-full max-w-6xl items-center gap-1.5">
            <Label htmlFor="email">Product Name</Label>
            <Input
              type="text"
              id="product-name"
              placeholder="Ex. Nikon Coolpix A300 Digital Camera"
            />
          </div>
          <div className="grid w-full max-w-6xl items-center gap-1.5">
            <Label htmlFor="email">Category</Label>
            <CategoryDropdown />
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
