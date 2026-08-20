import { createRemoteFeedbackError } from "@/modules/core/lib/utils.feedback";
import { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";
import { $ZodIssue } from "zod/v4/core";

export type ValidationFieldErrors = Record<string, string[]>;

export interface ValidationFeedback {
  summary: string;
  fieldErrors: ValidationFieldErrors;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const pushFieldError = (
  fieldErrors: ValidationFieldErrors,
  path: string,
  message: string,
) => {
  if (!fieldErrors[path]) {
    fieldErrors[path] = [];
  }
  fieldErrors[path].push(message);
};

export const fromZodIssues = (issues: $ZodIssue[]): ValidationFeedback => {
  const fieldErrors: ValidationFieldErrors = {};
  issues.forEach((issue) => {
    const path = issue.path.join(".");
    if (path) {
      pushFieldError(fieldErrors, path, issue.message);
    }
  });

  return {
    summary: "Please fix the highlighted fields.",
    fieldErrors,
  };
};

export const getValidationFeedback = (
  input: unknown,
  fallbackSummary = "Please fix the highlighted fields.",
): ValidationFeedback | null => {
  if (typeof input === "string") {
    return { summary: input, fieldErrors: {} };
  }

  if (input instanceof Error) {
    const structured = (input as Error & { details?: unknown }).details;
    if (isRecord(structured)) {
      return getValidationFeedback(structured, fallbackSummary);
    }

    return { summary: input.message || fallbackSummary, fieldErrors: {} };
  }

  if (!isRecord(input)) {
    return null;
  }

  const target =
    "metaData" in input && isRecord(input.metaData)
      ? input.metaData.error
      : input;

  if (typeof target === "string") {
    return { summary: target, fieldErrors: {} };
  }

  if (!isRecord(target)) {
    return null;
  }

  const fieldErrors: ValidationFieldErrors = {};
  Object.entries(target).forEach(([key, entry]) => {
    if (typeof entry === "string") {
      pushFieldError(fieldErrors, key, entry);
      return;
    }
    if (Array.isArray(entry)) {
      entry.forEach((item) => {
        if (typeof item === "string") {
          pushFieldError(fieldErrors, key, item);
        }
      });
    }
  });

  const hasFieldErrors = Object.keys(fieldErrors).length > 0;
  if (!hasFieldErrors) {
    return null;
  }

  return {
    summary: fallbackSummary,
    fieldErrors,
  };
};

export const applyValidationFeedback = <TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>,
  feedback: ValidationFeedback,
) => {
  Object.entries(feedback.fieldErrors).forEach(([path, messages]) => {
    const message = messages[0];
    if (!message) {
      return;
    }

    setError(path as FieldPath<TFieldValues>, {
      type: "manual",
      message,
    });
  });
};

export const toValidationFeedbackError = (input: unknown, fallback?: string) =>
  createRemoteFeedbackError(input, fallback);
