import ApiResponseSchema from "@/modules/core/domain/schemas/ApiResponse";
import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { createRemoteFeedbackError } from "@/modules/core/lib/utils.feedback";
import { formattedIssues } from "@/modules/core/utils/zod.util";
import { z } from "zod";

export default async function postDataAndValidate<TData, TResponse>(
  endpoint: { module: string; path: string },
  data: TData,
  responseSchema: z.ZodType<TResponse>,
  errorMessage: string,
): Promise<TResponse> {
  const instance = await authAxiosInstance();
  if (!instance) throw new Error("Authentication error.");

  let upstream;
  if (!instance) {
    throw new Error("Authentication error.");
  }
  try {
    upstream = await instance.post(endpoint.path, data);
  } catch (error) {
    throw createRemoteFeedbackError(error, errorMessage);
  }
  const parsed = ApiResponseSchema(responseSchema).safeParse(upstream.data);

  if (!parsed.success) {
    const issues = formattedIssues(parsed.error.issues);
    console.log(
      "schema validation error on post data: ",
      issues,
      endpoint.path,
    );
    throw createRemoteFeedbackError(
      new Error("API response schema validation failed"),
      "API response schema validation failed",
    );
  }
  const { data: payloadData, metaData } = parsed.data;

  if (payloadData.payload === null || metaData.error) {
    throw createRemoteFeedbackError({ metaData }, "API returned null payload");
  }
  return payloadData.payload;
}
