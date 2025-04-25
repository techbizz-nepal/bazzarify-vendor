import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { TAttribute } from "@/modules/product.management";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";

interface ICategoryAttributesCard {
  attributes: TAttribute[];
  selectedIds: string[] | null;
  onAttributeChange: (id: TAttribute["uuid"]) => void;
  onUpdateAction: (entity: "specifications" | "attributes") => void;
}

const CategoryAttributesCard = ({
  attributes,
  selectedIds,
  onAttributeChange,
  onUpdateAction,
}: ICategoryAttributesCard) => {
  console.log(selectedIds);
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-lg">Attributes</CardTitle>
          <ThemedButton onClick={() => onUpdateAction("attributes")}>
            Update Attributes
          </ThemedButton>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-6 space-x-2">
          {attributes.length > 0
            ? attributes.map((item) => (
                <div
                  className="uppercase flex space-x-2 items-center"
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
            : "N/A"}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryAttributesCard;
