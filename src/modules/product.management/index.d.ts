import { ChangeEvent } from "react";

export type TSpecification = {
  id: string;
  key: string;
  type: string;
};
export type TCategory = {
  id: string;
  name: string;
  position: string;
  slug: string;
  specifications: TSpecification[];
  attributes: TAttribute[];
  parent?: TCategory;
  children?: TCategory[];
};
export type TAttribute = {
  id: string;
  name: string;
  values: [];
};
export type TProducts = {
  id: string;
  name: string;
};

export interface IPaginatedData<T> {
  current_page: number;
  data: T;
  from: number;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: 15;
}

export interface IDataTableProps<TEntity> {
  page: number;
  data: IPaginatedData<TEntity[]> | null;
  onNextAction: () => void;
  onPreviousAction: () => void;
  rowsCount: number;
  onViewAction: (slug: string) => void;
  onEditAction: (slug: string) => void;
  onFilterChangeAction: (e: ChangeEvent<HTMLInputElement>) => void;
  onOnlyLastChildrenAction?: () => void;
}
