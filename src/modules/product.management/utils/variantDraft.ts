import { TAttribute, TVariant } from "@/modules/product.management";

const normalizeVariantOptionValue = (value: string) => value.trim();

export const createVariantDraftKey = (optionValues: readonly string[]) =>
  JSON.stringify(optionValues.map(normalizeVariantOptionValue));

export const createVariantName = (optionValues: readonly string[]) =>
  optionValues
    .map((value) => normalizeVariantOptionValue(value).toLowerCase())
    .join("|");

const getFallbackOptionValuesFromVariantName = (variantName: string) =>
  variantName
    .split("|")
    .map((value) => normalizeVariantOptionValue(value))
    .filter(Boolean);

export const resolveVariantOptionValues = (
  attributeNames: readonly string[],
  variant: Pick<TVariant, "attributes" | "name">,
) => {
  const valuesByAttributeName = new Map(
    (variant.attributes || []).map(({ attribute, attribute_value }) => [
      attribute.name,
      attribute_value.label,
    ]),
  );

  const orderedValues = attributeNames.map(
    (attributeName) => valuesByAttributeName.get(attributeName) || "",
  );

  if (orderedValues.some((value) => value !== "")) {
    return orderedValues;
  }

  return getFallbackOptionValuesFromVariantName(variant.name);
};

export const resolveVariantOptionValuesFromAttributes = (
  categoryAttributes: readonly TAttribute[],
  variant: Pick<TVariant, "attributes" | "name">,
) =>
  resolveVariantOptionValues(
    categoryAttributes.map((attribute) => attribute.name),
    variant,
  );
