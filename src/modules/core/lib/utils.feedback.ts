import { IMetaData } from "@/modules/core";
import { AxiosError } from "axios";

type EnvelopeMeta = {
  error?: unknown;
  errorCode?: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const flattenMessage = (value: unknown): string | null => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (Array.isArray(value)) {
    const messages = value
      .map((entry) => flattenMessage(entry))
      .filter((entry): entry is string => Boolean(entry));
    return messages.length > 0 ? messages.join(", ") : null;
  }

  if (isRecord(value)) {
    const messages = Object.values(value)
      .map((entry) => flattenMessage(entry))
      .filter((entry): entry is string => Boolean(entry));
    return messages.length > 0 ? messages.join(", ") : null;
  }

  return null;
};

const parseErrorCode = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const getEnvelopeMeta = (value: unknown): EnvelopeMeta | null => {
  if (!isRecord(value) || !("metaData" in value) || !isRecord(value.metaData)) {
    return null;
  }

  return value.metaData as EnvelopeMeta;
};

export const extractRemoteErrorFeedback = (
  value: unknown,
  fallbackMessage = "Something went wrong!",
): IMetaData | null => {
  const envelope = getEnvelopeMeta(value);
  if (envelope) {
    const error = flattenMessage(envelope.error);
    if (!error) {
      return null;
    }
    return {
      error,
      errorCode: parseErrorCode(envelope.errorCode),
    };
  }
  if (value instanceof AxiosError) {
    const nested = getEnvelopeMeta(value.response?.data);
    if (nested) {
      return {
        error: flattenMessage(nested.error) ?? fallbackMessage,
        errorCode: parseErrorCode(nested.errorCode) ?? value.response?.status,
      };
    }

    return {
      error:
        flattenMessage(value.message) ??
        flattenMessage(value.code) ??
        fallbackMessage,
      errorCode: value.response?.status,
    };
  }

  if (value instanceof Error) {
    return {
      error: flattenMessage(value.message) ?? fallbackMessage,
      errorCode: parseErrorCode(
        (value as Error & { errorCode?: unknown }).errorCode,
      ),
    };
  }

  return {
    error: flattenMessage(value) ?? fallbackMessage,
    errorCode: undefined,
  };
};

export const createRemoteFeedbackError = (
  value: unknown,
  fallbackMessage = "Something went wrong!",
) => {
  const feedback = extractRemoteErrorFeedback(value, fallbackMessage);
  const error = new Error(feedback?.error ?? fallbackMessage);
  (error as Error & { details?: unknown }).details =
    isRecord(value) && "metaData" in value && isRecord(value.metaData)
      ? value.metaData.error
      : value;
  if (typeof feedback?.errorCode === "number") {
    error.name = String(feedback.errorCode);
  }
  return error;
};
