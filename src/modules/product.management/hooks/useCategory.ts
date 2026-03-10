import {
  TAttribute,
  TCategory,
  TSpecification,
} from "@/modules/product.management";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { loadProductCategoryContext } from "@/modules/product.management/utils/productAuthoring";

interface useCategoryProps {
  setCategoryAttributes: Dispatch<SetStateAction<TAttribute[]>>;
  setVariantSelections?: Dispatch<SetStateAction<Record<string, string[]>>>;
}

export default function useCategory({
  setCategoryAttributes,
  setVariantSelections,
}: useCategoryProps) {
  const [selectedCategories, setSelectedCategories] = useState<TCategory[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [subCategories, setSubCategories] = useState<TCategory[]>([]);
  const [subChildCategories, setSubChildCategories] = useState<TCategory[]>([]);
  const [categorySpecifications, setCategorySpecifications] = useState<
    TSpecification[]
  >([]);
  const [specifications, setSpecifications] = useState<Record<string, string>>(
    {},
  );
  const [filters, setFilters] = useState({ root: "", sub: "", subchild: "" });

  /** functions **/
  const handleShowDropdownChange = () => {
    setShowDropdown(!showDropdown);
  };
  const handleClickRoot = (category: TCategory) => {
    setSubCategories(category.children || []);
    setSubChildCategories([]);
    setSelectedCategories([category]);
  };

  const handleClickSub = (category: TCategory) => {
    setSubChildCategories(category.children || []);
    setSelectedCategories((prev) => [prev[0], category]);
  };

  const handleClickSubChild = async (category: TCategory) => {
    setSelectedCategories((prev) => [prev[0], prev[1], category]);
    const categoryContext = await loadProductCategoryContext(category);
    if ("error" in categoryContext) {
      toast.error(categoryContext.error);
      return;
    }

    setCategorySpecifications(categoryContext.specifications);
    setSpecifications({});
    setCategoryAttributes(categoryContext.attributes);
    setVariantSelections?.({});

    setShowDropdown(!showDropdown);
  };

  const updateFilter = (level: "root" | "sub" | "subchild", value: string) => {
    setFilters((prev) => ({ ...prev, [level]: value }));
  };
  const handleSpecificationChange = (key: string, value: string) => {
    setSpecifications((prev) => ({ ...prev, [key]: value }));
  };

  return {
    selectedCategories,
    showDropdown,
    subCategories,
    subChildCategories,
    categorySpecifications,
    specifications,
    filters,
    handleClickRoot,
    handleShowDropdownChange,
    handleClickSubChild,
    handleClickSub,
    updateFilter,
    setSpecifications,
    setCategorySpecifications,
    setCategoryAttributes,
    setFilters,
    setSubChildCategories,
    setSubCategories,
    setSelectedCategories,
    setShowDropdown,
    handleSpecificationChange,
  };
}
