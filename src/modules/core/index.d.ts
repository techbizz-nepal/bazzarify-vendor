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
  perPage?: string;
  with?: array;
  filter?: { [key: string]: string };
  subChildOnly?: boolean;
  rootOnly?: boolean;
  sort?: string;
  include?: string;
};
export type TEntities =
  | "category"
  | "product"
  | "attribute"
  | "specification"
  | "login"
  | "register"
  | "reset";

export interface RouteConfig {
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}

export type IRoute = {
  [E in TEntities]: Record<string, RouteConfig>;
};
