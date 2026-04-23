import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";
import { TAttribute } from "@/modules/product.management";

interface ICategoryAttributesCard {
  attributes: TAttribute[];
  selectedIds: string[] | null;
  feedbackMessage?: string | null;
  isLoading?: boolean;
  onAttributeChange: (id: TAttribute["uuid"]) => void;
  onUpdateAction: () => void;
}

const CategoryAttributesCard = ({
  attributes,
  selectedIds,
  feedbackMessage,
  isLoading,
  onAttributeChange,
  onUpdateAction,
}: ICategoryAttributesCard) => {
  const renderSkeletonRows = () =>
    Array.from({ length: 6 }).map((_, index) => (
      <div className="flex items-center space-x-2 uppercase" key={index}>
        <Skeleton className="h-4 w-4 rounded-sm" />
        <Skeleton className="h-4 w-24" />
      </div>
    ));

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <CardTitle className="text-lg">Attributes</CardTitle>
            <ThemedButton onClick={onUpdateAction}>
              Update Attributes
            </ThemedButton>
          </div>
          <p className="text-sm text-muted-foreground">
            Attributes make a category sellable because variant combinations are
            generated from them.
          </p>
          {feedbackMessage ? (
            <p className="text-sm font-medium text-destructive">
              {feedbackMessage}
            </p>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        <div className="min-h-[120px]">
          {isLoading ? (
            <div className="grid grid-cols-6 space-x-2">
              {renderSkeletonRows()}
            </div>
          ) : (
            <div className="grid grid-cols-6 space-x-2">
              {attributes.length > 0
                ? attributes.map((item) => (
                    <div
                      className="flex items-center space-x-2 uppercase"
                      key={item.uuid}
                    >
                      <div>
                        <Checkbox
                          checked={selectedIds?.includes(item.uuid)}
                          onClick={() => onAttributeChange(item.uuid)}
                        />
                      </div>
                      <div>{item.name}</div>
                    </div>
                  ))
                : null}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryAttributesCard;
