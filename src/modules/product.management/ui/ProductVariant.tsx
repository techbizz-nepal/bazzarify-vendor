"use client";

import { TAttribute, VariantState } from "@/modules/product.management";
import AttributeSelector from "@/modules/product.management/ui/AttributeSelector";
import VariantGrid from "@/modules/product.management/ui/VariantGrid";

interface IProductVariant {
  variantState: VariantState;
  attributes: TAttribute[];
}

export default function ProductVariant({
  variantState,
  attributes,
}: IProductVariant) {
  const {
    selections,
    columns,
    combinations,
    variantData,
    toggleValue,
    removeValue,
    handleVariantChange,
    handleImageUpload,
    handleImageRemove,
  } = variantState;

  return (
    <div className="space-y-8 p-6">
      <AttributeSelector
        attributes={attributes}
        selections={selections}
        onToggle={toggleValue}
        onRemove={removeValue}
      />
      <VariantGrid
        selections={selections}
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
