import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TCategory } from "@/modules/product.management";
import { CategoryDetailField } from "@/modules/product.management/ui/CategoryDetailField";

const CategoryCard = ({ category }: { category: TCategory }) => {
  const { name, parent, children } = category;
  const attributeCount = category.attributes?.length ?? 0;
  const specificationCount = category.specifications?.length ?? 0;
  const isSellable = category.is_sellable === true;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg">Detail</CardTitle>
          <span
            className={[
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
              isSellable
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            ].join(" ")}
          >
            {isSellable ? "Sellable" : "Browsable only"}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex-col space-y-2">
          <CategoryDetailField label="name" value={name} />
          {parent && <CategoryDetailField label="parent" value={parent.name} />}
          <CategoryDetailField
            label="attribute count"
            value={String(attributeCount)}
          />
          <CategoryDetailField
            label="specification count"
            value={String(specificationCount)}
          />
          {children && children.length > 0 && (
            <CategoryDetailField
              label="children"
              value={children.map((child) => child.name).join(", ")}
            />
          )}
          <p className="text-sm text-muted-foreground">
            {isSellable
              ? "This category is sellable because it has attributes. Specifications remain optional metadata."
              : "Attach at least one attribute to make this category sellable. Specifications alone do not make a category sellable."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
export default CategoryCard;
