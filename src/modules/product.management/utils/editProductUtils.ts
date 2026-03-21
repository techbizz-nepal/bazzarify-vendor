import {
  TAttribute,
  TVariant,
  TVariantDataMap,
} from "@/modules/product.management";
import { MAX_VARIANT_IMAGE_COUNT } from "@/modules/product.management/config/constants/IMAGE_CONSTANTS";
import {
  createVariantDraftKey,
  resolveVariantOptionValuesFromAttributes,
} from "@/modules/product.management/utils/variantDraft";
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
    const variantOptionValues = resolveVariantOptionValuesFromAttributes(
      categoryAttributes,
      variant,
    );
    // Normalize images to string URLs for UI consumption while preserving other fields
    const base = (variant.image_base_url || "").replace(/\/+$/, "");
    const toFull = (file: string) =>
      /^(https?:)?\/\//.test(file)
        ? file
        : `${base}/${String(file).replace(/^\/+/, "")}`;
    const normalizedImages = (variant.images || []).map((img: unknown) => {
      if (img instanceof File) return img;
      if (
        img &&
        typeof img === "object" &&
        "file" in (img as Record<string, unknown>) &&
        typeof (img as { file?: unknown }).file === "string"
      ) {
        return toFull((img as { file: string }).file);
      }
      if (typeof img === "string") return toFull(img);
      return String(img);
    });
    const limitedImages = normalizedImages.slice(0, MAX_VARIANT_IMAGE_COUNT);
    variantData[createVariantDraftKey(variantOptionValues)] = {
      ...variant,
      stock:
        variant.stock === undefined || variant.stock === null
          ? ""
          : String(variant.stock),
      price:
        variant.price === undefined || variant.price === null
          ? ""
          : String(variant.price),
      images: limitedImages as unknown as TVariant["images"],
    };
  });
  return { variantSelections, columns, variantData };
}
