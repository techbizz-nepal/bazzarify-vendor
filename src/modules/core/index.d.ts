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

export interface IApiResponse<T> {
  data: {
    message: string;
    payload: T;
  };
  metaData: {
    error: string;
    errorCode: string;
  };
}

export type TURLSearchParams = {
  page?: number;
  perPage?: number;
  with?: array;
  filter?: string;
  onlyLastChildren?: boolean;
};

export type IRoute = {
  [key: string]: {
    path: string;
    name: string;
    method?: string;
  };
};
