import { ProductSubmissionFeedback } from "@/modules/product.management";

const getCandidatePaths = (path: string): string[] => {
  const candidates = new Set<string>([path]);
  candidates.add(path.replace(/\[([^\]]+)\]/g, ".$1"));

  return Array.from(candidates);
};

export const getSubmissionFieldError = (
  feedback: ProductSubmissionFeedback | null,
  path: string,
): string | undefined => {
  for (const candidate of getCandidatePaths(path)) {
    const message = feedback?.fieldErrors[candidate]?.[0];
    if (message) {
      return message;
    }
  }

  return undefined;
};

export const hasSubmissionFieldError = (
  feedback: ProductSubmissionFeedback | null,
  path: string,
): boolean => Boolean(getSubmissionFieldError(feedback, path));

export const hasSubmissionFieldPrefix = (
  feedback: ProductSubmissionFeedback | null,
  prefix: string,
): boolean =>
  Object.keys(feedback?.fieldErrors ?? {}).some((fieldPath) =>
    getCandidatePaths(prefix).some(
      (candidate) =>
        fieldPath === candidate || fieldPath.startsWith(`${candidate}.`),
    ),
  );
