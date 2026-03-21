import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ThemedTooltip } from "@/modules/core/components/ui/ThemedTooltip";
import { IProductCard } from "@/modules/product.management";

const ProductCard = ({ title, children, tooltip, className }: IProductCard) => (
  <Card className={cn(className)}>
    <CardHeader className="flex items-center ">
      <p className="text-lg font-semibold">{title}</p>
      {tooltip && <ThemedTooltip {...tooltip} />}
    </CardHeader>
    <CardContent className="flex-col space-y-7">{children}</CardContent>
  </Card>
);

export default ProductCard;
