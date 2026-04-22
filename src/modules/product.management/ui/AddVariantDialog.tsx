"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TAttribute } from "@/modules/product.management";
import { createVariantDraftKey } from "@/modules/product.management/utils/variantDraft";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attributes: TAttribute[];
  columns: string[];
  selections: Record<string, string[]>;
  existingComboKeys: Set<string>;
  onAdd: (combo: string[]) => void;
}

export default function AddVariantDialog({
  open,
  onOpenChange,
  attributes,
  columns,
  selections,
  existingComboKeys,
  onAdd,
}: Props) {
  const activeColumns = useMemo(
    () => columns.filter((col) => (selections[col] || []).length > 0),
    [columns, selections],
  );
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const resolveValueOptions = (columnName: string): string[] => {
    const fromSelections = selections[columnName] || [];
    if (fromSelections.length > 0) return fromSelections;
    const attr = attributes.find((a) => a.name === columnName);
    return attr?.attribute_value.map((v) => v.label) ?? [];
  };

  const reset = () => {
    setDraft({});
    setError(null);
  };

  const handleAdd = () => {
    const combo = activeColumns.map((col) => draft[col] ?? "");
    if (combo.some((value) => !value.trim())) {
      setError("Select a value for every attribute.");
      return;
    }
    const key = createVariantDraftKey(combo);
    if (existingComboKeys.has(key)) {
      setError("This variant combination already exists.");
      return;
    }
    onAdd(combo);
    reset();
    onOpenChange(false);
  };

  if (activeColumns.length === 0) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) reset();
        onOpenChange(nextOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Plus className="mr-1 h-4 w-4" /> Add variant
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add variant</DialogTitle>
          <DialogDescription>
            Pick a value for each active attribute to create a new variant row.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {activeColumns.map((col) => {
            const options = resolveValueOptions(col);
            return (
              <div key={col} className="space-y-1">
                <Label>{col}</Label>
                <Select
                  value={draft[col] ?? ""}
                  onValueChange={(value) => {
                    setError(null);
                    setDraft((prev) => ({ ...prev, [col]: value }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Select ${col}`} />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {options.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleAdd}>
            Add variant
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
