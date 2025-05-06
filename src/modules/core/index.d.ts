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

export interface ApiResponse<T> {
  data: {
    message: string;
    payload: Record<string, T>;
  };
  metaData: {
    error: string | null;
    errorCode: number;
  };
}

export interface FetchAction {
  (params?: Record<string, T>): Promise<ApiResponse<T> | null>;
}

export interface UseDataTableControllerOptions {
  entityKey: string;
  fetchAction: FetchAction;
}

export interface Entity {
  uuid: string;
  slug: string;

  [key: string]: string | number | boolean | null;
}

type TCustomURLSearchParams = TURLSearchParams &
  Record<string, string | number | boolean>;

interface DataTableProps {
  entityKey: string;
  columns: { label: string; accessor: string }[];
  fetchAction: (params?: TURLSearchParams) => Promise<ApiResponse<T> | null>;
  filterOptions?: { label: string; value: string; key: string }[];
  defaultFilter?: string;
}

export interface SimplePaginationMeta {
  current_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export type TURLSearchParams = {
  page?: number;
  perPage?: string;
  with?: array;
  filter?: object;
  rootOnly?: boolean;
  sort?: string;
  include?: string;
  uuids?: string;
};
export type TEntities =
  | "category"
  | "product"
  | "attribute"
  | "specification"
  | "login"
  | "register"
  | "reset"
  | "user";

export interface RouteConfig {
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}

export type IRoute = {
  [E in TEntities]: Record<string, RouteConfig>;
};
