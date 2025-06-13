"use client";

import {
  VariantSelectorState,
  VariantState,
} from "@/modules/product.management";
import AttributeSelector from "@/modules/product.management/ui/AttributeSelector";
import VariantGrid from "@/modules/product.management/ui/VariantGrid";

interface IProductVariant {
  variantState: VariantState;
  selectorState: VariantSelectorState;
}

export default function ProductVariant({
  variantState,
  selectorState,
}: IProductVariant) {
  const {
    columns,
    combinations,
    variantData,
    handleVariantChange,
    handleImageUpload,
    handleImageRemove,
  } = variantState;

  const { variantSelections, attributes, toggleValue, removeValue } =
    selectorState;
  return (
    <div className="space-y-8">
      <AttributeSelector
        attributes={attributes}
        selections={variantSelections}
        onToggle={toggleValue}
        onRemove={removeValue}
      />
      <VariantGrid
        selections={variantSelections}
        combinations={combinations}
        variantData={variantData}
        onChange={handleVariantChange}
        onUpload={handleImageUpload}
        onImageRemove={handleImageRemove}
        columns={columns}
      />
    </div>
  );
}
