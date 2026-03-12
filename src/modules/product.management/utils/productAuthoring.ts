import { IMetaData } from "@/modules/core";
import { fromZodIssues } from "@/modules/core/lib/utils.validationFeedback";
import { z } from "zod";
import { actionGetAttributes } from "@/modules/product.management/actions/attribute";
import { actionViewCategorySpecifications } from "@/modules/product.management/actions/category";
import {
  ProductSubmissionFeedback,
  TAttribute,
  TAttributesIndexPayload,
  TCategory,
  TSpecificationsIndexPayload,
  TSpecification,
  TVariantDataMap,
  TVariantPayload,
} from "@/modules/product.management";
import {
  appendFormDataVariants,
  createVariantsPayload,
  updateVariantValidity,
} from "@/modules/product.management/utils/productForm";

export interface ProductCategoryContext {
  attributes: TAttribute[];
  specifications: TSpecification[];
}

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
  selectedCategoryUuid?: string;
  combinations: string[][];
  columns: string[];
  variantData: TVariantDataMap;
  uploadedProductImages: File[];
  specifications: Record<string, string>;
  categoryAttributes: TAttribute[];
}

export const loadProductCategoryContext = async (
  category: TCategory,
): Promise<ProductCategoryContext | IMetaData> => {
  const [specificationsResponse, attributesResponse]: [
    IMetaData | TSpecificationsIndexPayload,
    IMetaData | TAttributesIndexPayload,
  ] = await Promise.all([
    actionViewCategorySpecifications(category.slug),
    actionGetAttributes({
      uuids: category.attributes?.join(","),
    }),
  ]);

  if ("error" in specificationsResponse || "error" in attributesResponse) {
    return {
      error:
        ("error" in specificationsResponse && specificationsResponse.error) ||
        ("error" in attributesResponse && attributesResponse.error) ||
        "Oops, something went wrong while fetching category data!",
    };
  }

  return {
    specifications: specificationsResponse.specifications?.data || [],
    attributes: attributesResponse.attributes?.data || [],
  };
};

export const prepareProductSubmission = <TSchema extends z.ZodTypeAny>({
  schema,
  product,
  productSku,
  selectedCategoryUuid,
  combinations,
  columns,
  variantData,
  uploadedProductImages,
  specifications,
  categoryAttributes,
}: PrepareProductSubmissionInput<TSchema>):
  | ProductSubmissionFailure
  | ProductSubmissionSuccess<z.infer<TSchema>> => {
  const { updated, allValid } = updateVariantValidity(combinations, variantData);

  if (!allValid) {
    return {
      ok: false,
      kind: "variants",
      message: "Please fill stock, price, SKU, images for variants.",
      feedback: {
        summary: "Please complete the required variant fields before submitting.",
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
    category: selectedCategoryUuid,
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

  Object.entries(
    validationResult.data as Record<string, unknown>,
  ).forEach(([key, value]) => {
    if (key === "variants") {
      return;
    }

    formData.append(key, String(value));
  });

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
