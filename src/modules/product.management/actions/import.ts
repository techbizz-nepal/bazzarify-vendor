"use server";

import ApiResponseSchema from "@/modules/core/domain/schemas/ApiResponse";
import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { extractRemoteErrorFeedback } from "@/modules/core/lib/utils.feedback";
import { handleUnknownError } from "@/modules/core/lib/utils.index";
import {
  TProductImportActivePayload,
  TProductImportGuidePayload,
  TProductImportListPayload,
  TProductImportProcessPayload,
  TProductImportTargetStorePayload,
  TProductImportUploadPayload,
  TProductImportValidationPayload,
} from "@/modules/product.management";
import { PRODUCT_MANAGEMENT_ROUTES } from "@/modules/product.management/config/routes";
import {
  ProductImportActiveImportErrorSchema,
  ProductImportActivePayloadSchema,
  ProductImportGuidePayloadSchema,
  ProductImportListPayloadSchema,
  ProductImportProcessPayloadSchema,
  ProductImportTargetStorePayloadSchema,
  ProductImportUploadPayloadSchema,
  ProductImportValidationPayloadSchema,
} from "@/modules/product.management/schemas/ProductImportSchema";
import { getValidationFeedback } from "@/modules/core/lib/utils.validationFeedback";
import { isAxiosError } from "axios";
import { z } from "zod";

type ImportActionFeedback =
  | {
      summary: string;
      fieldErrors: Record<string, string[]>;
    }
  | ReturnType<typeof handleUnknownError>;

const safeStringify = (value: unknown): string => {
  if (value === undefined) return "undefined";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const logImportSchemaFailure = (
  marker: string,
  error: unknown,
  payload: unknown,
) => {
  const feedback = extractRemoteErrorFeedback(error);
  const message =
    feedback?.error ??
    (error instanceof Error ? error.message : "Unknown import action error");
  const stack = error instanceof Error ? error.stack : "<no stack>";
  console.error(
    `${marker} ${message}\npayload=${safeStringify(payload)}\nstack=${stack}`,
  );
};

function throwSchemaFailure(
  marker: string,
  parsedError: z.ZodError,
  label: string,
): never {
  throw new Error(
    `${label} [${marker}] ${z.prettifyError(parsedError)}`,
  );
}

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
      throwSchemaFailure(
        "product-import-guide-schema",
        parsed.error,
        "Product import guide schema validation failed.",
      );
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
      throwSchemaFailure(
        "product-import-store-options-schema",
        parsed.error,
        "Product import store-options schema validation failed.",
      );
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

type CreateProductImportResult =
  | TProductImportUploadPayload
  | ImportActionFeedback
  | { redirectTo: string; activeImportUuid: string };

export const actionCreateProductImport = async (
  payload: FormData,
  idempotencyKey?: string,
): Promise<CreateProductImportResult> => {
  try {
    const client = await authAxiosInstance();
    const response = await client.post(
      PRODUCT_MANAGEMENT_ROUTES.product.importStore.path,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
        },
      },
    );

    const parsed = ApiResponseSchema(
      ProductImportUploadPayloadSchema,
    ).safeParse(response.data);

    if (!parsed.success) {
      throwSchemaFailure(
        "product-import-upload-schema",
        parsed.error,
        "Product import upload schema validation failed.",
      );
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
      const activeImportParsed = ProductImportActiveImportErrorSchema.safeParse(
        (error.response.data as { metaData?: { error?: { active_import?: unknown } } })
          ?.metaData?.error?.active_import,
      );
      if (activeImportParsed.success) {
        return {
          redirectTo: `/products/imports/${activeImportParsed.data.uuid}`,
          activeImportUuid: activeImportParsed.data.uuid,
        };
      }

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

export const actionGetProductImports = async (
  params?: Record<string, string | string[] | undefined>,
): Promise<TProductImportListPayload | ReturnType<typeof handleUnknownError>> => {
  try {
    const client = await authAxiosInstance();
    const response = await client.get(
      PRODUCT_MANAGEMENT_ROUTES.product.importIndex.path,
      { params },
    );

    const parsed = ApiResponseSchema(ProductImportListPayloadSchema).safeParse(
      response.data,
    );

    if (!parsed.success) {
      throwSchemaFailure(
        "product-import-index-schema",
        parsed.error,
        "Product import list schema validation failed.",
      );
    }

    if (parsed.data.metaData.error || parsed.data.data.payload === null) {
      return normalizeActionError(
        response.data,
        "Unable to load product imports.",
      );
    }

    return parsed.data.data.payload as TProductImportListPayload;
  } catch (error) {
    logImportSchemaFailure("[product-import-index]", error, params);
    return handleUnknownError(error);
  }
};

export const actionGetActiveProductImport = async (
  storeUuid?: string,
): Promise<TProductImportActivePayload | ReturnType<typeof handleUnknownError>> => {
  try {
    const client = await authAxiosInstance();
    const response = await client.get(
      PRODUCT_MANAGEMENT_ROUTES.product.importActive.path,
      {
        params: storeUuid ? { store_uuid: storeUuid } : undefined,
      },
    );

    const parsed = ApiResponseSchema(ProductImportActivePayloadSchema).safeParse(
      response.data,
    );

    if (!parsed.success) {
      throwSchemaFailure(
        "product-import-active-schema",
        parsed.error,
        "Active product import schema validation failed.",
      );
    }

    if (parsed.data.metaData.error || parsed.data.data.payload === null) {
      return normalizeActionError(
        response.data,
        "Unable to load active product import.",
      );
    }

    return parsed.data.data.payload;
  } catch (error) {
    logImportSchemaFailure("[product-import-active]", error, { storeUuid });
    return handleUnknownError(error);
  }
};

export const actionCancelProductImport = async (
  uuid: string,
): Promise<TProductImportUploadPayload | ImportActionFeedback> => {
  try {
    const client = await authAxiosInstance();
    const response = await client.post(
      PRODUCT_MANAGEMENT_ROUTES.product.importCancel.path.replace(":uuid", uuid),
    );

    const parsed = ApiResponseSchema(ProductImportUploadPayloadSchema).safeParse(
      response.data,
    );

    if (!parsed.success) {
      throwSchemaFailure(
        "product-import-cancel-schema",
        parsed.error,
        "Product import cancel schema validation failed.",
      );
    }

    if (parsed.data.metaData.error || parsed.data.data.payload === null) {
      return normalizeActionError(response.data, "Unable to cancel import.");
    }

    return parsed.data.data.payload;
  } catch (error) {
    logImportSchemaFailure("[product-import-cancel]", error, { uuid });
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
      throwSchemaFailure(
        "product-import-validate-schema",
        parsed.error,
        "Product import validation schema validation failed.",
      );
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

export const actionGetProductImport = async (
  uuid: string,
): Promise<TProductImportUploadPayload | ReturnType<typeof handleUnknownError>> => {
  try {
    const client = await authAxiosInstance();
    const response = await client.get(
      PRODUCT_MANAGEMENT_ROUTES.product.importShow.path.replace(":uuid", uuid),
    );

    const parsed = ApiResponseSchema(
      ProductImportUploadPayloadSchema,
    ).safeParse(response.data);

    if (!parsed.success) {
      throwSchemaFailure(
        "product-import-show-schema",
        parsed.error,
        "Product import show schema validation failed.",
      );
    }

    if (parsed.data.metaData.error || parsed.data.data.payload === null) {
      return normalizeActionError(response.data, "Unable to fetch import status.");
    }

    return parsed.data.data.payload;
  } catch (error) {
    logImportSchemaFailure("[product-import-show]", error, { uuid });
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
      throwSchemaFailure(
        "product-import-process-schema",
        parsed.error,
        "Product import process schema validation failed.",
      );
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
