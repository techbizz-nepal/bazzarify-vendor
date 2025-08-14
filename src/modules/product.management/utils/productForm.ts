import {
  TAttribute,
  TVariant,
  TVariantDataMap,
  TVariantPayload,
} from "@/modules/product.management";
import {
  MAX_DIMENSION,
  MIN_DIMENSION,
} from "@/modules/product.management/config/constants/IMAGE_CONSTANTS";
import slugify from "slugify";
import { toast } from "sonner";

export const isValidVariant = (variant: TVariant): boolean => {
  return !!(
    variant.stock &&
    variant.price &&
    variant.sku &&
    variant.images?.length
  );
};

export const updateVariantValidity = (
  combinations: string[][],
  variantData: TVariantDataMap,
): { updated: TVariantDataMap; allValid: boolean } => {
  let valid = true;
  const updated: TVariantDataMap = { ...variantData };

  combinations.forEach((combo) => {
    const key = combo.join("|");
    const variant = updated[key] || {};
    const isValid = isValidVariant(variant);
    updated[key] = { ...variant, isValid };
    if (!isValid) valid = false;
  });
  return { updated, allValid: valid };
};

export const createVariantsPayload = (
  combinations: string[][],
  columns: string[],
  variantData: TVariantDataMap,
): TVariantPayload[] => {
  return combinations.map((combo) => {
    const data: Record<string, string> = {};
    columns.forEach((attr, i) => {
      data[slugify(attr, { lower: true })] = combo[i] || "";
    });

    const key = combo.join("|");
    const variant = variantData[key] || {};

    return {
      ...data,
      name: key.toLowerCase(),
      stock: variant.stock || "0",
      price: variant.price || "",
      sku: variant.sku || "",
      images: variant.images,
      available: variant.available ?? true,
    };
  });
};

export const appendFormDataVariants = (
  formData: FormData,
  variants: TVariantPayload[],
  columns: string[],
  categoryAttributes: TAttribute[],
) => {
  variants.forEach((variant, index) => {
    columns.forEach((attr) => {
      const key = slugify(attr, { lower: true });
      const value = (variant as never)[key];
      const attribute = categoryAttributes.find((a) => a.name === key);
      const attributeValue = attribute?.attribute_value.find(
        (v) => v.label === value,
      );

      if (!attribute || !attributeValue) return;

      formData.append(
        `variants[${index}][attribute][${key}|${value}][attributeUuid]`,
        attribute.uuid,
      );
      formData.append(
        `variants[${index}][attribute][${key}|${value}][attributeValueUuid]`,
        attributeValue.uuid,
      );
    });

    formData.append(`variants[${index}][name]`, variant.name);
    formData.append(`variants[${index}][stock]`, variant.stock || "0");
    formData.append(`variants[${index}][price]`, variant.price || "0");
    formData.append(`variants[${index}][sku]`, variant.sku || "");
    formData.append(
      `variants[${index}][available]`,
      variant.available ? "1" : "0",
    );

    variant.images?.forEach((image, i) => {
      formData.append(`variants[${index}][images][${i}]`, image);
    });
  });
};

export const validateImage = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    // Basic MIME type guard
    if (!file.type || !file.type.startsWith("image/")) {
      toast.error("Selected file is not a valid image.");
      resolve(false);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      // Revoke as soon as we're done to avoid memory leaks
      URL.revokeObjectURL(objectUrl);

      if (
        img.width < MIN_DIMENSION ||
        img.height < MIN_DIMENSION ||
        img.width > MAX_DIMENSION ||
        img.height > MAX_DIMENSION
      ) {
        toast.error(
          `Image dimensions must be between ${MIN_DIMENSION}x${MIN_DIMENSION} and ${MAX_DIMENSION}x${MAX_DIMENSION}px.`,
        );
        resolve(false);
      } else {
        resolve(true);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      toast.error("Could not read the image. Please try a different file.");
      resolve(false);
    };

    img.src = objectUrl;
  });
};
