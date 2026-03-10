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
import {
  createVariantDraftKey,
  createVariantName,
} from "@/modules/product.management/utils/variantDraft";
import slugify from "slugify";
import { toast } from "sonner";

export const isValidVariant = (variant: TVariant): boolean => {
  return !!(variant.stock && variant.price && variant.images?.length);
};

export const updateVariantValidity = (
  combinations: string[][],
  variantData: TVariantDataMap,
): { updated: TVariantDataMap; allValid: boolean } => {
  let valid = true;
  const updated: TVariantDataMap = { ...variantData };

  combinations.forEach((combo) => {
    const key = createVariantDraftKey(combo);
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

    const key = createVariantDraftKey(combo);
    const variant = variantData[key] || {};

    return {
      ...data,
      uuid: variant.uuid,
      name: createVariantName(combo),
      stock: variant.stock || "0",
      price: variant.price || "",
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

    if (variant.uuid) {
      formData.append(`variants[${index}][uuid]`, variant.uuid);
    }
    formData.append(`variants[${index}][name]`, variant.name);
    formData.append(`variants[${index}][stock]`, variant.stock || "0");
    formData.append(`variants[${index}][price]`, variant.price || "0");
    formData.append(
      `variants[${index}][available]`,
      variant.available ? "1" : "0",
    );

    // Only append new images (File instances). Existing images (strings/URLs or TImage) must not be re-submitted on update.
    let imgIndex = 0;
    variant.images?.forEach((image) => {
      if (image instanceof File) {
        formData.append(`variants[${index}][images][${imgIndex}]`, image);
        imgIndex += 1;
      }
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
