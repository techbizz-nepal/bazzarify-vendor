"use client";

import {
  TAttribute,
  TCategory,
  VariantState,
} from "@/modules/product.management";
import VariantGrid from "@/modules/product.management/ui/VariantGrid";
import AttributeSelector from "@/modules/product.management/ui/AttributeSelector";

interface IProductVariant {
  variantState: VariantState;
  category: TCategory;
}

export default function ProductVariant({
  variantState,
  category,
}: IProductVariant) {
  const attributes = category.attributes_with_model as TAttribute[];

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
