"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TVariant } from "@/modules/product.management";
import { Eraser } from "lucide-react";
import { useState } from "react";

interface Props {
  selectedCount: number;
  onClear: () => void;
  onApply: (
    patch: Partial<Pick<TVariant, "price" | "stock" | "available">>,
  ) => void;
}

export default function VariantBulkEditBar({
  selectedCount,
  onClear,
  onApply,
}: Props) {
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [available, setAvailable] = useState<boolean | null>(null);

  if (selectedCount === 0) {
    return null;
  }

  const handleApply = () => {
    const patch: Partial<Pick<TVariant, "price" | "stock" | "available">> = {};
    if (price.trim() !== "") patch.price = price.trim();
    if (stock.trim() !== "") patch.stock = stock.trim();
    if (available !== null) patch.available = available;
    if (Object.keys(patch).length === 0) return;
    onApply(patch);
    setPrice("");
    setStock("");
    setAvailable(null);
  };

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-muted/40 p-3">
      <div className="mr-auto text-sm font-medium">
        {selectedCount} variant{selectedCount === 1 ? "" : "s"} selected
      </div>
      <div className="space-y-1">
        <label className="block text-xs text-muted-foreground">Price</label>
        <Input
          type="number"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="h-8 w-24"
          placeholder="—"
        />
      </div>
      <div className="space-y-1">
        <label className="block text-xs text-muted-foreground">Stock</label>
        <Input
          type="number"
          min="0"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="h-8 w-24"
          placeholder="—"
        />
      </div>
      <div className="space-y-1">
        <label className="block text-xs text-muted-foreground">Available</label>
        <div className="flex h-8 items-center gap-2">
          <Switch
            checked={available === true}
            onCheckedChange={(checked) =>
              setAvailable(available === checked ? null : checked)
            }
          />
          <span className="text-xs text-muted-foreground">
            {available === null ? "no change" : available ? "on" : "off"}
          </span>
        </div>
      </div>
      <Button type="button" size="sm" onClick={handleApply}>
        Apply to selection
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={onClear}
        aria-label="Clear selection"
      >
        <Eraser className="mr-1 h-4 w-4" /> Clear
      </Button>
    </div>
  );
}
