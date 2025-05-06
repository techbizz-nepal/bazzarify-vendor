import { SimplePaginationMeta, TURLSearchParams } from "@/modules/core";
import { AxiosError } from "axios";

export const phoneRegex = /^9\d{9}$/;
export const handleRemoteError = (error: unknown) => {
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
