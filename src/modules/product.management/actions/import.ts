"use server";

import ApiResponseSchema from "@/modules/core/domain/schemas/ApiResponse";
import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { extractRemoteErrorFeedback } from "@/modules/core/lib/utils.feedback";
import { handleUnknownError } from "@/modules/core/lib/utils.index";
import {
  TProductImportGuidePayload,
  TProductImportProcessPayload,
  TProductImportTargetStorePayload,
  TProductImportUploadPayload,
  TProductImportValidationPayload,
} from "@/modules/product.management";
import { PRODUCT_MANAGEMENT_ROUTES } from "@/modules/product.management/config/routes";
import {
  ProductImportGuidePayloadSchema,
  ProductImportProcessPayloadSchema,
  ProductImportTargetStorePayloadSchema,
  ProductImportUploadPayloadSchema,
  ProductImportValidationPayloadSchema,
} from "@/modules/product.management/schemas/ProductImportSchema";
import { getValidationFeedback } from "@/modules/core/lib/utils.validationFeedback";
import { isAxiosError } from "axios";

type ImportActionFeedback =
  | {
      summary: string;
      fieldErrors: Record<string, string[]>;
    }
  | ReturnType<typeof handleUnknownError>;

const logImportSchemaFailure = (
  marker: string,
  error: unknown,
  payload: unknown,
) => {
  const feedback = extractRemoteErrorFeedback(error);
  console.error(marker, {
    error: feedback?.error ?? (error instanceof Error ? error.message : "Unknown import action error"),
    payload,
  });
};

const normalizeActionError = (
  value: unknown,
  fallback: string,
): { error: string } => ({
  error: extractRemoteErrorFeedback(value, fallback)?.error ?? fallback,
});

export const actionGetProductImportGuide = async (): Promise<
  TProductImportGuidePayload | ReturnType<typeof handleUnknownError>
> => {
  try {
    const client = await authAxiosInstance();
    const response = await client.get(
      PRODUCT_MANAGEMENT_ROUTES.product.importGuide.path,
    );

    const parsed = ApiResponseSchema(ProductImportGuidePayloadSchema).safeParse(
      response.data,
    );

    if (!parsed.success) {
      console.error("[product-import-guide-schema]", parsed.error.flatten());
      throw new Error("Product import guide schema validation failed.");
    }

    if (parsed.data.metaData.error || parsed.data.data.payload === null) {
      return normalizeActionError(
        response.data,
        "Unable to load product import guidance.",
      );
    }

    return parsed.data.data.payload;
  } catch (error) {
    logImportSchemaFailure("[product-import-guide]", error, null);
    return handleUnknownError(error);
  }
};

export const actionGetProductImportTargetStores = async (
  search?: string,
): Promise<TProductImportTargetStorePayload | ReturnType<typeof handleUnknownError>> => {
  try {
    const client = await authAxiosInstance();
    const response = await client.get(
      PRODUCT_MANAGEMENT_ROUTES.product.importStoreOptions.path,
      {
        params: search ? { search } : undefined,
      },
    );

    const parsed = ApiResponseSchema(
      ProductImportTargetStorePayloadSchema,
    ).safeParse(response.data);

    if (!parsed.success) {
      console.error("[product-import-store-options-schema]", parsed.error.flatten());
      throw new Error("Product import store-options schema validation failed.");
    }

    if (parsed.data.metaData.error || parsed.data.data.payload === null) {
      return normalizeActionError(
        response.data,
        "Unable to load product import target stores.",
      );
    }

    return parsed.data.data.payload;
  } catch (error) {
    logImportSchemaFailure("[product-import-store-options]", error, { search });
    return handleUnknownError(error);
  }
};

export const actionCreateProductImport = async (
  payload: FormData,
): Promise<TProductImportUploadPayload | ImportActionFeedback> => {
  try {
    const client = await authAxiosInstance();
    const response = await client.post(
      PRODUCT_MANAGEMENT_ROUTES.product.importStore.path,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const parsed = ApiResponseSchema(
      ProductImportUploadPayloadSchema,
    ).safeParse(response.data);

    if (!parsed.success) {
      console.error("[product-import-upload-schema]", parsed.error.flatten());
      throw new Error("Product import upload schema validation failed.");
    }

    if (parsed.data.metaData.error || parsed.data.data.payload === null) {
      return (
        getValidationFeedback(
          response.data,
          "Please fix the highlighted import fields.",
        ) ?? {
          error: extractRemoteErrorFeedback(
            response.data,
            "Unable to upload import package.",
          )?.error ?? "Unable to upload import package.",
        }
      );
    }

    return parsed.data.data.payload;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data) {
      return (
        getValidationFeedback(
          error.response.data,
          "Please fix the highlighted import fields.",
        ) ?? handleUnknownError(error)
      );
    }

    logImportSchemaFailure("[product-import-upload]", error, null);
    return handleUnknownError(error);
  }
};

export const actionValidateProductImport = async (
  uuid: string,
): Promise<TProductImportValidationPayload | ImportActionFeedback> => {
  try {
    const client = await authAxiosInstance();
    const response = await client.post(
      PRODUCT_MANAGEMENT_ROUTES.product.importValidate.path.replace(":uuid", uuid),
    );

    const parsed = ApiResponseSchema(
      ProductImportValidationPayloadSchema,
    ).safeParse(response.data);

    if (!parsed.success) {
      console.error("[product-import-validate-schema]", parsed.error.flatten());
      throw new Error("Product import validation schema validation failed.");
    }

    if (parsed.data.metaData.error || parsed.data.data.payload === null) {
      return normalizeActionError(response.data, "Unable to validate import.");
    }

    return parsed.data.data.payload;
  } catch (error) {
    logImportSchemaFailure("[product-import-validate]", error, { uuid });
    return handleUnknownError(error);
  }
};

export const actionProcessProductImport = async (
  uuid: string,
): Promise<TProductImportProcessPayload | ImportActionFeedback> => {
  try {
    const client = await authAxiosInstance();
    const response = await client.post(
      PRODUCT_MANAGEMENT_ROUTES.product.importProcess.path.replace(":uuid", uuid),
    );

    const parsed = ApiResponseSchema(
      ProductImportProcessPayloadSchema,
    ).safeParse(response.data);

    if (!parsed.success) {
      console.error("[product-import-process-schema]", parsed.error.flatten());
      throw new Error("Product import process schema validation failed.");
    }

    if (parsed.data.metaData.error || parsed.data.data.payload === null) {
      return normalizeActionError(response.data, "Unable to process import.");
    }

    return parsed.data.data.payload;
  } catch (error) {
    logImportSchemaFailure("[product-import-process]", error, { uuid });
    return handleUnknownError(error);
  }
};
