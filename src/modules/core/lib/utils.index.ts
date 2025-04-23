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
