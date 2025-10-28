import {
  IMetaData,
  SimplePaginationMeta,
  TURLSearchParams,
} from "@/modules/core";
import { AxiosError } from "axios";
import { Duration, intervalToDuration } from "date-fns";

export const phoneRegex = /^9\d{9}$/;
export const handleRemoteError = (error: unknown) => {
  let message: string = "Something went wrong!";
  let errorCode = 500;
  if (error instanceof AxiosError) {
    message = error.response?.data?.metaData?.error;
    errorCode = error.response?.data?.metaData?.errorCode;
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

export function getDurationFromTimestamps(pastDate: Date) {
  const now = new Date();
  const isFuture = pastDate > now;

  const duration = intervalToDuration({
    start: isFuture ? now : pastDate,
    end: isFuture ? pastDate : now,
  });

  const interval = (
    [
      "years",
      "months",
      "days",
      "hours",
      "minutes",
      "seconds",
    ] as (keyof Duration)[]
  ).find((key) => duration[key]! > 0);

  return interval
    ? `${duration[interval]} ${interval.slice(0, -1)}${duration[interval] === 1 ? "" : "s"} ${isFuture ? "from now" : "ago"}`
    : "just now";
}
