import { ChangeEvent, Dispatch, ReactNode, SetStateAction } from "react";

export type TSpecification = {
  uuid: string;
  id: string;
  key: string;
  type: string;
};
export type TCategory = {
  uuid: string;
  id: string;
  name: string;
  position: string;
  slug: string;
  specifications: string[];
  specifications_with_model: TSpecification[];
  attributes: string[];
  attributes_with_model?: TAttribute[];
  parent?: TCategory;
  children?: TCategory[];
};
export type TAttributeValue = {
  uuid: string;
  attribute_uuid: string;
  label: string;
  code: string;
};
export type TAttribute = {
  uuid: string;
  id: string;
  name: string;
  attribute_value: TAttributeValue[];
};

export interface VariantData {
  stock?: string;
  price?: string;
  sku?: string;
  images?: File[];
  isValid?: boolean;
  available?: boolean;
}

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

export interface VariantState {
  selections: Record<string, string[]>;
  setSelections: Dispatch<SetStateAction<Record<string, string[]>>>;
  toggleValue: (attribute: string, value: string) => void;
  removeValue: (attribute: string, value: string) => void;
  combinations: string[][];
  variantData: Record<string, VariantData>;
  handleVariantChange: <K extends keyof VariantData>(
    combo: string[],
    field: K,
    value: VariantData[K],
  ) => void;
  handleImageUpload: (combo: string[], files: FileList) => void;
  handleImageRemove: (combo: string[], image: File) => void;
  columns: string[];
  handleReorderColumns: (newOrder: string[]) => void;
}

export interface IProductCard {
  title: string;
  children?: ReactNode;
}
