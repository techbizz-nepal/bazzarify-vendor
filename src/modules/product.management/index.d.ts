import type { SerializedEditorState } from "lexical";
import { ChangeEvent, Dispatch, ReactNode, SetStateAction } from "react";

export type TSpecification = {
  uuid: string;
  key: string;
  type: string;
};
export type TCategory = {
  uuid: string;
  id: string;
  name: string;
  position?: string;
  slug: string;
  specifications?: string[];
  specifications_with_model?: TSpecification[];
  attributes?: string[];
  attributes_with_model?: TAttribute[];
  parent?: TCategory;
  children?: TCategory[];
};
export type TProduct = {
  type: "retail" | "wholesale";
  uuid?: string;
  image_base_path?: string;
  image_base_url?: string;
  id: string;
  name: string;
  slug: string;
  base_price: string;
  description?: string;
  highlights?: string;
  box_items?: string;
  category: TCategory;
  images: TImage[];
  specifications: Record<string, string>;
  variants: TVariant[];
};
export type TImage = {
  uuid: string;
  file: string;
};

export interface TProductForm {
  type: string;
  uuid?: string;
  name: string;
  base_price: string;
  description: string;
  highlights: string;
  box_items: string;
  category?: string;
}
export interface TProductImagesForm {
  uploadedImages: File[];
  existingImages: ExistingImage[];
}

export type TAttributeValue = {
  uuid: string;
  attribute_uuid: string;
  label: string;
  code: string;
};
export type TAttribute = {
  uuid: string;
  name: string;
  attribute_value: TAttributeValue[];
};

export interface TVariant {
  uuid?: string;
  name: string;
  image_base_path?: string;
  image_base_url?: string;
  stock?: string;
  price?: string;
  sku?: string;
  images?: (string | File | TImage)[];
  isValid?: boolean;
  available?: boolean;
  attributes?: { attribute: TAttribute; attribute_value: TAttributeValue }[];
}
export type TVariantDataMap = Record<string, TVariant>;
export type TVariantPayload = {
  name: string;
  stock?: string;
  price?: string;
  sku?: string;
  images?: (string | File | TImage)[];
  available?: boolean;
  [key: string]: string | boolean | (string | File | TImage)[] | undefined;
};
export type TCategoryIndexPayload = {
  categories: IPaginatedData<TCategory[]>;
  totalCount: number;
};
export type TProductIndexPayload = {
  categories: IPaginatedData<TProduct[]>;
};

export type TSpecificationsIndexPayload = {
  specifications: IPaginatedData<TSpecification[]>;
};
export type TAttributesIndexPayload = {
  attributes: IPaginatedData<TAttribute[]>;
};
export type TShowProductPayload = {
  product: TProduct;
};
export type TCategoryAncestors = {
  root: Pick<TCategory, "id" | "name" | "uuid" | "slug">;
  sub: Pick<TCategory, "id" | "name" | "uuid" | "slug">;
  subChild: Pick<TCategory, "id" | "name" | "uuid" | "slug">;
};
export type TEditProductPayload = {
  product: TProduct;
  categoryAncestors: TCategoryAncestors;
};
export type TCategoryViewParentRecursivePayload = {
  category: TCategory;
  subCategory: TCategory[];
  subChildCategory: TCategory[];
  specifications: TSpecification[];
  attributes: TAttribute[];
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
export interface VariantSelectorState {
  attributes: TAttribute[];
  variantSelections: Record<string, string[]>;
  toggleValue: (attribute: string, value: string) => void;
  removeValue: (attribute: string, value: string) => void;
}
export interface VariantState {
  setVariantSelections: Dispatch<SetStateAction<Record<string, string[]>>>;
  combinations: string[][];
  variantData: TVariantDataMap;
  handleVariantChange: <K extends keyof TVariant>(
    combo: string[],
    field: K,
    value: TVariant[K],
  ) => void;
  handleImageUpload: (combo: string[], files: FileList) => void;
  handleImageRemove: (combo: string[], image: File | string) => void;
  columns: string[];
  handleReorderColumns?: (newOrder: string[]) => void;
}

export interface IProductCard {
  title: string;
  children?: ReactNode;
  tooltip?: TooltipConfig;
}
export type TooltipTrigger = { type: "icon" } | { type: "text"; label: string };

export type TooltipConfig = {
  trigger: TooltipTrigger;
  texts: string[];
};
export type ProductEditorValue = string | SerializedEditorState | undefined;
export interface ProductRichTextEditorProps {
  name: string;
  toolbar: RTEToolbarVariant;
  value?: ProductEditorValue;
  handleOnChange?: (name: string, value: string) => void;
  className?: string;
  placeholder: string;
  enableImages?: boolean;
}
type RTEToolbarVariant = "full" | "minimal" | "none";
