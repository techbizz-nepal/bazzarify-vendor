import ApiResponseSchema from "@/modules/core/domain/schemas/ApiResponse";
import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
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
    console.error("postDataAndValidate error", error);
    throw new Error(errorMessage);
  }
  const parsed = ApiResponseSchema(responseSchema).safeParse(upstream.data);

  if (!parsed.success) {
    const issues = formattedIssues(parsed.error.issues);
    console.log("postDataAndValidate", issues);
    throw new Error("API response schema validation failed");
  }
  const { payload } = parsed.data.data;
  if (payload === null) {
    throw new Error("API returned null payload");
  }
  console.log("postDataAndValidate", payload);
  return payload;
}
