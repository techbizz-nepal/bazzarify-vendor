import { $ZodIssue } from "zod/v4/core";
import { z } from "zod";

export const formattedIssues = (issues: $ZodIssue[]) =>
  issues.map((issue: $ZodIssue) => ({
    path: issue.path.join("."),
    message: issue.message,
    code: issue.code,
  }));
export const emptyAsNull = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((val) => {
    if (val === null || val === "null") return null;
    if (Array.isArray(val) && val.length === 0) return null;
    if (
      typeof val === "object" &&
      val !== null &&
      !Array.isArray(val) &&
      Object.keys(val).length === 0
    )
      return null;
    return val;
  }, schema.nullable());
