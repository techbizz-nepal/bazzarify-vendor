import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TCategory } from "@/modules/product.management";
import { CategoryDetailField } from "@/modules/product.management/components/client/category/ui/CategoryDetailField";

const CategoryCard = ({ category }: { category: TCategory }) => {
  const { name, parent, position, children } = category;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Detail</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex-col space-y-2">
          <CategoryDetailField label="name" value={name} />
          <CategoryDetailField label="position" value={position} />
          {parent && <CategoryDetailField label="parent" value={parent.name} />}
          {children && children.length > 0 && (
            <CategoryDetailField
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
