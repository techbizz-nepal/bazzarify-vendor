import { TCategory, TSpecification } from "@/modules/product.management";
import { useState } from "react";

export default function useCategory() {
  const [selectedCategories, setSelectedCategories] = useState<TCategory[]>([]);
  const [committedCategories, setCommittedCategories] = useState<TCategory[]>(
    [],
  );
  const [committedCategory, setCommittedCategory] = useState<TCategory | null>(
    null,
  );
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

  const handleClickSubChild = (category: TCategory) => {
    setSelectedCategories((prev) => [prev[0], prev[1], category]);
  };

  const updateFilter = (level: "root" | "sub" | "subchild", value: string) => {
    setFilters((prev) => ({ ...prev, [level]: value }));
  };
  const handleSpecificationChange = (key: string, value: string) => {
    setSpecifications((prev) => ({ ...prev, [key]: value }));
  };

  return {
    selectedCategories,
    committedCategories,
    committedCategory,
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
    setFilters,
    setSubChildCategories,
    setSubCategories,
    setCommittedCategories,
    setCommittedCategory,
    setSelectedCategories,
    setShowDropdown,
    handleSpecificationChange,
  };
}
