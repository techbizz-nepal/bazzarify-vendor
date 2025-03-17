export type MetaData = {
  error: string;
  executionTime: number;
  errorCode: number;
};
export type Data = {
  message: string;
  payload: unknown;
};

export type ResponseDTO = {
  data: Data;
  metaData: MetaData;
};

export const defaultResponseDTO: ResponseDTO = {
  data: {
    message: "",
    payload: "",
  },
  metaData: {
    error: "",
    errorCode: 50000,
    executionTime: 0,
  },
};
