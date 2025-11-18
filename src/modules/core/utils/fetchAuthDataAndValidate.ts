import ApiResponseSchema from "@/modules/core/domain/schemas/ApiResponse";
import {
  authAxiosInstance,
  defaultAxiosInstance,
} from "@/modules/core/lib/utils.axios";
import { formattedIssues } from "@/modules/core/utils/zod.util";
import { AxiosResponse } from "axios";
import { z } from "zod";

export async function fetchAuthDataAndValidate<Payload>(
  endpoint: { module: string; path: string },
  responsePayloadSchema: z.ZodType<Payload>,
  errorMessage: string,
): Promise<Payload> {
  const instance = await authAxiosInstance();
  if (!instance) throw new Error("Authentication error.");

  let upstream;
  try {
    upstream = await instance.get(endpoint.path);
  } catch (error) {
    throw new Error(errorMessage, { cause: error });
  }

  const result = ApiResponseSchema(responsePayloadSchema).safeParse(
    upstream.data,
  );

  if (!result.success) {
    const issues = formattedIssues(result.error.issues);
    console.log("schema error on fetch auth data: ", issues, endpoint.path);
    throw new Error("API response schema validation failed", { cause: issues });
  }
  const { payload } = result.data.data;
  if (payload === null) {
    throw new Error("API returned null payload");
  }

  return payload;
}

export default async function fetchDataAndValidate<Payload extends z.ZodType>(
  endpoint: string,
  responsePayloadSchema: z.ZodType<Payload>,
  errorMessage: string,
  params?: Record<string, string>,
): Promise<Payload> {
  let upstream: AxiosResponse<unknown>;
  try {
    upstream = await defaultAxiosInstance.get(endpoint, { params });
  } catch (error) {
    throw new Error(errorMessage, { cause: error });
  }
  const result = ApiResponseSchema(responsePayloadSchema).safeParse(
    upstream.data,
  );

  if (!result.success) {
    const issues = formattedIssues(result.error.issues);
    console.log("schema error on fetch guest data: ", issues, endpoint);
    throw new Error("API response schema validation failed", { cause: issues });
  }
  const { payload } = result.data.data;
  if (payload === null) {
    throw new Error("API returned null payload");
  }

  return payload;
}
