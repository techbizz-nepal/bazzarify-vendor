import {
  TAttribute,
  TVariant,
  TVariantDataMap,
} from "@/modules/product.management";
import { Dispatch, SetStateAction } from "react";

interface IFillSelectedProductVariantData {
  setVariantSelections: Dispatch<SetStateAction<Record<string, string[]>>>;
  setColumns: Dispatch<SetStateAction<string[]>>;
  setVariantData: Dispatch<SetStateAction<TVariantDataMap>>;
  selectedProductVariants: TVariant[];
  categoryAttributes: TAttribute[];
}

export const fillSelectedProductVariantData = (
  args: IFillSelectedProductVariantData,
) => {
  const {
    setColumns,
    setVariantData,
    setVariantSelections,
    selectedProductVariants,
    categoryAttributes,
  } = args;

  const { columns, variantData, variantSelections } = transformProductVariants(
    categoryAttributes,
    selectedProductVariants,
  );
  setVariantSelections(variantSelections);
  setColumns(columns);
  setVariantData(variantData);
};

export const getVariantNameWithUppercase = (variantName: string): string => {
  const parts = variantName.split("|").map((part) => part.trim());
  if (parts.length === 1) {
    return `${parts[0].charAt(0).toUpperCase()}${parts[0].slice(1)}`;
  }
  return `${parts[0].charAt(0).toUpperCase()}${parts[0].slice(1)}|${parts[1].charAt(0).toUpperCase()}${parts[1].slice(1)}`;
};

function transformProductVariants(
  categoryAttributes: TAttribute[],
  selectedProductVariants: TVariant[],
) {
  const variantSelections: Record<string, string[]> = {};
  const columns: string[] = [];
  const variantData: TVariantDataMap = {};

  // Populate columns based on categoryAttributes order
  categoryAttributes?.forEach((attr) => {
    columns.push(attr.name);
    variantSelections[attr.name] = [];
  });

  // Extract selected attribute values from selectedProductVariants
  selectedProductVariants.forEach((variant) => {
    variant.attributes?.forEach((attr) => {
      const attributeName = attr.attribute.name;
      const attributeLabel = attr.attribute_value.label;
      if (
        variantSelections[attributeName] &&
        !variantSelections[attributeName].includes(attributeLabel)
      ) {
        variantSelections[attributeName].push(attributeLabel);
      }
    });
    const variantName = getVariantNameWithUppercase(variant.name);
    variant["images"] = [];
    variantData[variantName] = variant;
  });
  return { variantSelections, columns, variantData };
}
