export interface IData<T> {
  message: string;
  payload: T;
}

export interface IMetaData {
  error: string | null;
  errorCode?: number;
}

export interface ApiResponse<T> {
  data: IData<T>;
  metaData: IMetaData;
}

export interface FetchAction<T> {
  (params?: Record<string, T>): Promise<T>;
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

interface DataTableProps<T> {
  entityKey: string;
  columns: { label: string; accessor: string }[];
  fetchAction: FetchAction<T>;
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
  | "variant"
  | "image"
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

export type IPageParams = {
  params: Promise<{ slug: string }>;
};
