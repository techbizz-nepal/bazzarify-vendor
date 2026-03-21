import type { SerializedEditorState } from "lexical";
import type { TUser } from "@/modules/auth/domain/schemas/UserSchema";
import type { TServerDataTableMeta } from "@/modules/core/domain/schemas/ServerDataTableMeta";
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
  uuid: string;
  created_by_user_uuid?: string | null;
  updated_by_user_uuid?: string | null;
  sku: string;
  image_base_path?: string;
  image_base_url?: string;
  id: string;
  name: string;
  slug: string;
  base_price: string;
  description?: string;
  highlights?: string;
  box_items?: string;
  category?: TCategory;
  categories?: TCategory[];
  createdBy?: Pick<TUser, "uuid" | "name"> | null;
  updatedBy?: Pick<TUser, "uuid" | "name"> | null;
  images: TImage[];
  specifications: Record<string, string>;
  variants: TVariant[];
  status_text?: string;
  status?: number;
  created_at?: string | null;
  updated_at?: string | null;
};
export type TImage = {
  uuid: string;
  file: string;
};

export interface TProductForm {
  type: string;
  sku: string;
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
  images?: (string | File | TImage)[];
  isValid?: boolean;
  available?: boolean;
  attributes?: { attribute: TAttribute; attribute_value: TAttributeValue }[];
}
export type TVariantDataMap = Record<string, TVariant>;
export type TVariantPayload = {
  uuid?: string;
  name: string;
  stock?: string;
  price?: string;
  images?: (string | File | TImage)[];
  available?: boolean;
  [key: string]: string | boolean | (string | File | TImage)[] | undefined;
};
export type TCategoryIndexPayload = {
  categories: IPaginatedData<TCategory[]>;
  totalCount: number;
  table: TServerDataTableMeta;
};
export type TProductIndexPayload = {
  products: IPaginatedData<TProduct[]>;
  table: TServerDataTableMeta;
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
  categoryContext: TCategoryAuthoringContextPayload | null;
};
export type TCategoryAuthoringContextPayload = {
  categoryAncestors: TCategoryAncestors;
  subCategories: TCategory[];
  subChildCategories: TCategory[];
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
  handleImageRemove: (combo: string[], image: File | string | TImage) => void;
  columns: string[];
  handleReorderColumns?: (newOrder: string[]) => void;
}

export interface ProductSubmissionFeedback {
  summary: string;
  fieldErrors: Record<string, string[]>;
}

export interface ProductAuthoringBasicState {
  productForm: TProductForm;
  onProductFormInputChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export interface ProductAuthoringCategoryState {
  showDropdown: boolean;
  selectedCategories: TCategory[];
  subCategories: TCategory[];
  subChildCategories: TCategory[];
  filters: { root: string; sub: string; subchild: string };
  handleShowDropdownChange: () => void;
  handleClickRoot: (category: TCategory) => void;
  handleClickSub: (category: TCategory) => void;
  handleClickSubChild: (category: TCategory) => Promise<void>;
  updateFilter: (level: "root" | "sub" | "subchild", value: string) => void;
}

export interface ProductAuthoringMediaState {
  existingProductImages: string[];
  handleProductImageUpload: (files: File[]) => void;
  handleExistingProductImagesChange: (images: string[]) => void;
  handleRemoveExistingProductImage?: (url: string) => Promise<boolean>;
}

export interface ProductAuthoringSpecificationState {
  categorySpecifications: TSpecification[];
  specificationValues: Record<string, string>;
  handleSpecificationChange: (key: string, value: string) => void;
}

export interface ProductAuthoringSubmissionState {
  feedback: ProductSubmissionFeedback | null;
  handleSubmit: () => Promise<void>;
}

export interface ProductAuthoringController {
  basicState: ProductAuthoringBasicState;
  categoryState: ProductAuthoringCategoryState;
  mediaState: ProductAuthoringMediaState;
  specificationState: ProductAuthoringSpecificationState;
  selectorState: VariantSelectorState;
  variantState: VariantState;
  submissionState: ProductAuthoringSubmissionState;
}

export interface IProductCard {
  title: string;
  children?: ReactNode;
  tooltip?: TooltipConfig;
  className?: string;
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
