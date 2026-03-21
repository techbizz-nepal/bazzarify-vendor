"use client";

import {
  ProductSubmissionFeedback,
  VariantSelectorState,
  VariantState,
} from "@/modules/product.management";
import AttributeSelector from "@/modules/product.management/ui/AttributeSelector";
import VariantGrid from "@/modules/product.management/ui/VariantGrid";

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
    combinations,
    variantData,
    handleVariantChange,
    handleImageUpload,
    handleImageRemove,
  } = variantState;

  const { variantSelections, attributes, toggleValue, removeValue } =
    selectorState;
  // Build non-removable values map: any attribute value used by an existing (fetched) variant (uuid present)
  const nonRemovable = attributes.reduce<Record<string, Set<string>>>(
    (acc, attr) => {
      acc[attr.name] = new Set<string>();
      return acc;
    },
    {},
  );
  Object.values(variantData).forEach((v) => {
    if (!v?.uuid) return; // only lock values from server-fetched variants
    v.attributes?.forEach(({ attribute, attribute_value }) => {
      if (!nonRemovable[attribute.name])
        nonRemovable[attribute.name] = new Set<string>();
      nonRemovable[attribute.name].add(attribute_value.label);
    });
  });

  return (
    <div className="space-y-8">
      <AttributeSelector
        attributes={attributes}
        selections={variantSelections}
        onToggle={toggleValue}
        onRemove={removeValue}
        nonRemovable={nonRemovable}
      />
      <VariantGrid
        selections={variantSelections}
        combinations={combinations}
        variantData={variantData}
        feedback={feedback}
        onChange={handleVariantChange}
        onUpload={handleImageUpload}
        onImageRemove={handleImageRemove}
        columns={columns}
      />
    </div>
  );
}
