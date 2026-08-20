"use client";

import { Button } from "@/components/ui/button";
import {
  ProductSubmissionFeedback,
  VariantSelectorState,
  VariantState,
} from "@/modules/product.management";
import AddVariantDialog from "@/modules/product.management/ui/AddVariantDialog";
import AttributeSelector from "@/modules/product.management/ui/AttributeSelector";
import VariantBulkEditBar from "@/modules/product.management/ui/VariantBulkEditBar";
import VariantGrid from "@/modules/product.management/ui/VariantGrid";
import { Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

interface IProductVariant {
  variantState: VariantState;
  selectorState: VariantSelectorState;
  feedback?: ProductSubmissionFeedback | null;
}

export default function ProductVariant({
  variantState,
  selectorState,
  feedback,
}: IProductVariant) {
  const {
    columns,
    rows,
    variantData,
    handleVariantChange,
    handleImageUpload,
    handleImageRemove,
    addVariant,
    generateMissingCombinations,
    deleteRow,
    bulkApply,
  } = variantState;

  const {
    variantSelections,
    attributes,
    toggleValue,
    removeValue,
    attributeCap,
    variantCountByValue,
  } = selectorState;

  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const nonRemovable = useMemo(() => {
    const acc = attributes.reduce<Record<string, Set<string>>>((map, attr) => {
      map[attr.name] = new Set<string>();
      return map;
    }, {});
    Object.values(variantData).forEach((v) => {
      if (!v?.uuid) return;
      v.attributes?.forEach(({ attribute, attribute_value }) => {
        if (!acc[attribute.name]) {
          acc[attribute.name] = new Set<string>();
        }
        acc[attribute.name].add(attribute_value.label);
      });
    });
    return acc;
  }, [attributes, variantData]);

  const existingComboKeys = useMemo(
    () => new Set(rows.map((row) => row.comboKey)),
    [rows],
  );

  const hasActiveAttribute = columns.some(
    (col) => (variantSelections[col] || []).length > 0,
  );

  return (
    <div className="space-y-6">
      <AttributeSelector
        attributes={attributes}
        selections={variantSelections}
        onToggle={toggleValue}
        onRemove={removeValue}
        nonRemovable={nonRemovable}
        attributeCap={attributeCap}
        variantCountByValue={variantCountByValue}
      />

      <div className="rounded-lg border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
        Availability lets you manually hide a variant from sale. Sellable
        quantity is calculated by the core backend from availability, stock, and
        reservations.
      </div>

      {hasActiveAttribute && (
        <div className="flex flex-wrap items-center gap-2">
          <AddVariantDialog
            open={addDialogOpen}
            onOpenChange={setAddDialogOpen}
            attributes={attributes}
            columns={columns}
            selections={variantSelections}
            existingComboKeys={existingComboKeys}
            onAdd={addVariant}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={generateMissingCombinations}
            title="Fill the grid with every combination of the selected values"
          >
            <Sparkles className="mr-1 h-4 w-4" /> Generate missing combinations
          </Button>
          <div className="text-xs text-muted-foreground">
            Rows show the variants you keep; add only the combinations you
            actually sell.
          </div>
        </div>
      )}

      <VariantBulkEditBar
        selectedCount={selectedRowIds.size}
        onClear={() => setSelectedRowIds(new Set())}
        onApply={(patch) => {
          bulkApply(Array.from(selectedRowIds), patch);
        }}
      />

      <VariantGrid
        selections={variantSelections}
        rows={rows}
        variantData={variantData}
        feedback={feedback}
        selectedRowIds={selectedRowIds}
        onSelectionChange={setSelectedRowIds}
        onChange={handleVariantChange}
        onUpload={handleImageUpload}
        onImageRemove={handleImageRemove}
        onDelete={(rowId) => {
          deleteRow(rowId);
          setSelectedRowIds((prev) => {
            if (!prev.has(rowId)) return prev;
            const next = new Set(prev);
            next.delete(rowId);
            return next;
          });
        }}
        columns={columns}
      />
    </div>
  );
}
