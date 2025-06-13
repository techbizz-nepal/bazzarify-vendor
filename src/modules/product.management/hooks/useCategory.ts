import {
  TAttribute,
  TCategory,
  TSpecification,
} from "@/modules/product.management";
import { actionGetAttributes } from "@/modules/product.management/actions/attribute";
import { actionViewCategorySpecifications } from "@/modules/product.management/actions/category";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

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
    const promises = await Promise.all([
      actionViewCategorySpecifications(category.slug),
      actionGetAttributes({
        uuids: category.attributes?.join(","),
      }),
    ]);
    const [specificationsResponse, attributesResponse] = promises;
    if ("error" in specificationsResponse || "error" in attributesResponse) {
      toast.error("Oops, something went wrong while fetching data!");
      return;
    }

    const specificationsData = specificationsResponse.specifications?.data;
    if (specificationsData) {
      setCategorySpecifications(specificationsData);
      setSpecifications({});
    }

    const attributesData = attributesResponse.attributes?.data;
    if (attributesData) {
      setCategoryAttributes(attributesData);
      setVariantSelections?.({});
    }

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
