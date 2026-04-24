import { IMetaData } from "@/modules/core";
import { fromZodIssues } from "@/modules/core/lib/utils.validationFeedback";
import {
  ProductSubmissionFeedback,
  TAttribute,
  TCategoryAuthoringContextPayload,
  TVariantDataMap,
  TVariantPayload,
} from "@/modules/product.management";
import { actionViewCategoryAuthoringContext } from "@/modules/product.management/actions/category";
import {
  appendFormDataVariants,
  createVariantsPayload,
  updateVariantValidity,
} from "@/modules/product.management/utils/productForm";
import { z } from "zod";

export type ProductSubmissionFailure =
  | {
      ok: false;
      kind: "variants";
      message: string;
      feedback: ProductSubmissionFeedback;
      updatedVariantData: TVariantDataMap;
    }
  | {
      ok: false;
      kind: "fields";
      message: string;
      feedback: ProductSubmissionFeedback;
      updatedVariantData: TVariantDataMap;
    };

export interface ProductSubmissionSuccess<TValidatedData> {
  ok: true;
  validatedData: TValidatedData;
  variants: TVariantPayload[];
  formData: FormData;
  updatedVariantData: TVariantDataMap;
}

interface PrepareProductSubmissionInput<TSchema extends z.ZodTypeAny> {
  schema: TSchema;
  product: Record<string, unknown>;
  productSku: string;
  committedCategoryUuid?: string;
  combinations: string[][];
  columns: string[];
  variantData: TVariantDataMap;
  uploadedProductImages: File[];
  specifications: Record<string, string>;
  categoryAttributes: TAttribute[];
}

export const loadProductCategoryContext = async (
  slug: string,
): Promise<TCategoryAuthoringContextPayload | IMetaData> =>
  actionViewCategoryAuthoringContext(slug);

export const prepareProductSubmission = <TSchema extends z.ZodTypeAny>({
  schema,
  product,
  productSku,
  committedCategoryUuid,
  combinations,
  columns,
  variantData,
  uploadedProductImages,
  specifications,
  categoryAttributes,
}: PrepareProductSubmissionInput<TSchema>):
  | ProductSubmissionFailure
  | ProductSubmissionSuccess<z.infer<TSchema>> => {
  const { updated, allValid } = updateVariantValidity(
    combinations,
    variantData,
  );

  if (!allValid) {
    return {
      ok: false,
      kind: "variants",
      message: "Please fill stock, price, SKU, images for variants.",
      feedback: {
        summary:
          "Please complete the required variant fields before submitting.",
        fieldErrors: {},
      },
      updatedVariantData: updated,
    };
  }

  const variants = createVariantsPayload(
    productSku,
    combinations,
    columns,
    updated,
  );
  const validationResult = schema.safeParse({
    ...product,
    category: committedCategoryUuid,
    variants,
  });

  if (!validationResult.success) {
    const feedback = fromZodIssues(validationResult.error.issues);
    const firstFieldError = Object.entries(feedback.fieldErrors)[0];

    return {
      ok: false,
      kind: "fields",
      message: firstFieldError
        ? `${firstFieldError[0]}: ${firstFieldError[1][0]}`
        : feedback.summary,
      feedback,
      updatedVariantData: updated,
    };
  }

  const formData = new FormData();

  Object.entries(validationResult.data as Record<string, unknown>).forEach(
    ([key, value]) => {
      if (key === "variants") {
        return;
      }

      if (key === "sku" && typeof value === "string" && value.trim() === "") {
        return;
      }

      formData.append(key, String(value));
    },
  );

  uploadedProductImages.forEach((image) => formData.append("images[]", image));
  Object.entries(specifications).forEach(([key, value]) => {
    formData.append(`specifications[${key}]`, value);
  });

  appendFormDataVariants(formData, variants, columns, categoryAttributes);

  return {
    ok: true,
    validatedData: validationResult.data,
    variants,
    formData,
    updatedVariantData: updated,
  };
};
