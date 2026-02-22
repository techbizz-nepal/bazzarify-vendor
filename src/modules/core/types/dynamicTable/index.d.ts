export interface IQueryParams {
  filters: IFilters;
  page: number;
}

export interface IFilters {
  payment_method: string;
  status: string;
  from: string;
  to: string;
}

//TODO use existing order schemas
interface OrderData {
  uuid: string;
  payment_method: string;
  order_number: string;
  placed_at: string;
  status: string;
  sub_total: number;
  shipping_information: never;
  buyer_uuid: string;
  buyer_type: string;
  items: unknown[];
  buyer: {
    name?: string | null;
    email?: string | null;
  } | null;
}

//TODO use existing order schemas
interface OrderResponse {
  current_page: number;
  data: OrderData[];
  first_page_url: string;
  from: number;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
}
