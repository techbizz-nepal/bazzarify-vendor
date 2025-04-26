import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";
import { TAttribute, TAttributeValue } from "@/modules/product.management";
import { Label } from "@radix-ui/react-menu";
import { Plus, Trash } from "lucide-react";

interface Props {
  attributes: TAttribute[];
  selections: Record<string, string[]>;
  onToggle: (attribute: string, value: string) => void;
  onRemove: (attribute: string, value: string) => void;
}

export default function AttributeSelector({
  attributes,
  selections,
  onToggle,
  onRemove,
}: Props) {
  return (
    <div className="space-y-6">
      {attributes.map((attr) => {
        const selectedValues = selections[attr.name] || [];
        const availableOptions = attr.attribute_value.filter(
          (val: TAttributeValue) => !selectedValues.includes(val.label),
        );

        return (
          <div key={attr.uuid} className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Label className="text-base font-medium">{attr.name}</Label>
            </div>
            <div className="space-y-2">
              {selectedValues.map((val) => (
                <div key={val} className="flex items-center gap-2">
                  <Select defaultValue={val} disabled>
                    <SelectTrigger className="w-64">
                      <SelectValue>{val}</SelectValue>
                    </SelectTrigger>
                    <SelectContent />
                  </Select>
                  <ThemedButton
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(attr.name, val)}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </ThemedButton>
                </div>
              ))}
              {availableOptions.length > 0 && (
                <div className="flex items-center gap-2">
                  <Select
                    value=""
                    onValueChange={(value) => onToggle(attr.name, value)}
                  >
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Please type or select" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableOptions.map((option) => (
                        <SelectItem key={option.uuid} value={option.label}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ThemedButton variant="ghost" size="icon" disabled>
                    <Plus className="h-4 w-4 text-gray-400" />
                  </ThemedButton>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
