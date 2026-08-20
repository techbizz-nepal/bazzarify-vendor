import { IApiMetaData, IApiResponse } from "@/modules/core/schemas/response";
import { AxiosError, isAxiosError } from "axios";

export const handleError = (error: unknown) => {
  const metaData: IApiMetaData = {
    error: error instanceof Error ? error.message : "Unknown error",
    errorCode: 500,
  };
  if (isAxiosError(error)) {
    const ax = error as AxiosError;
    const responseData = ax.response?.data as IApiResponse<IApiMetaData>;

    if (responseData !== undefined && "metaData" in responseData) {
      metaData["error"] = responseData.metaData.error;
      metaData["errorCode"] = responseData.metaData.errorCode;
    }
    return metaData;
  }
  return metaData;
};

export const handleParseError = (metaData: IApiMetaData) => {
  return Response.json(metaData, { status: metaData.errorCode ?? 500 });
};
