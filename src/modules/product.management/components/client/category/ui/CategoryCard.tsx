import { TCategory } from "@/modules/product.management";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailRow } from "@/modules/product.management/components/client/category/CategoryView";

const CategoryCard = ({ category }: { category: TCategory }) => {
  const { name, parent, position, children } = category;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Detail</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex-col space-y-2">
          <DetailRow label="name" value={name} />
          <DetailRow label="position" value={position} />
          {parent && <DetailRow label="parent" value={parent.name} />}
          {children && children.length > 0 && (
            <DetailRow
              label="children"
              value={children.map((child) => child.name).join(", ")}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default CategoryCard;
