import {
  IMetaData,
  SimplePaginationMeta,
  TURLSearchParams,
} from "@/modules/core";
import { AxiosError } from "axios";

export const phoneRegex = /^9\d{9}$/;
export const handleRemoteError = (error: unknown) => {
  console.log(error);
  let message: string = "Something went wrong!";
  let errorCode = 500;
  if (error instanceof AxiosError) {
    message = error.response?.data?.message;
    errorCode = error.response?.data?.errorCode;
  }
  return {
    data: {
      payload: [],
      message: "",
    },
    metaData: {
      error: message,
      errorCode: errorCode,
    },
  };
};

export function buildFetchParams({
  search,
  page,
  filters,
}: {
  search: string;
  page: number;
  filters?: Record<string, string>;
  includes?: string;
}): TURLSearchParams {
  return {
    filter: { name: search, ...(filters || {}) },
    page,
  };
}

export function isSimplePaginationMeta(
  obj: unknown,
): obj is SimplePaginationMeta {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "current_page" in obj &&
    "next_page_url" in obj &&
    "prev_page_url" in obj
  );
}

export function isValidRichTextEditorContent(content?: string): boolean {
  const hasImage = content?.includes("<img");
  const plainText = content?.replace(/<[^>]*>?/gm, "").trim();
  return !(plainText?.length === 0 && !hasImage);
}

export function isValidJson(value: string) {
  try {
    JSON.parse(value);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return false;
  }
}

export function handleUnknownError(error: unknown): IMetaData {
  if (error instanceof AxiosError) {
    return { error: error.code || "An unexpected error occurred" };
  } else {
    console.log(error);
    return { error: "An unexpected error occurred" };
  }
}
