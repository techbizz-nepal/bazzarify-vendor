import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TCategory } from "@/modules/product.management";
import { CategoryDetailField } from "@/modules/product.management/ui/CategoryDetailField";

const CategoryCard = ({
  category,
  isLoading = false,
}: {
  category?: TCategory;
  isLoading?: boolean;
}) => {
  if (!category && !isLoading) {
    return null;
  }

  const safeCategory = category ?? ({} as TCategory);
  const { name, parent, children } = safeCategory;
  const attributeCount = safeCategory.attributes?.length ?? 0;
  const specificationCount = safeCategory.specifications?.length ?? 0;
  const isSellable = safeCategory.is_sellable === true;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg">Detail</CardTitle>
          <span
            className={[
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
              isLoading
                ? "bg-muted text-muted-foreground"
                : isSellable
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
            ].join(" ")}
          >
            {isLoading ? "Loading" : isSellable ? "Sellable" : "Browsable only"}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex-col space-y-2">
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-60" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : (
          <div className="flex-col space-y-2">
            <CategoryDetailField label="name" value={name} />
            {parent && (
              <CategoryDetailField label="parent" value={parent.name} />
            )}
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
        )}
      </CardContent>
    </Card>
  );
};
export default CategoryCard;
