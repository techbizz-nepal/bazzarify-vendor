import { useMemo, useRef, useState } from "react";
import { TCategory, VariantData } from "@/modules/product.management";
import { useSuspenseQuery } from "@tanstack/react-query";
import { actionGetCategories } from "@/modules/product.management/actions/category";
import generateCombinations from "@/modules/product.management/utils/generateCombinations";
import slugify from "slugify";

export default function useCreateProduct() {
  // -------------------- STATE --------------------
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<TCategory[]>([]);
  const [subCategories, setSubCategories] = useState<TCategory[]>([]);
  const [subChildCategories, setSubChildCategories] = useState<TCategory[]>([]);
  const [filters, setFilters] = useState({ root: "", sub: "", subchild: "" });
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [specifications, setSpecifications] = useState<Record<string, string>>(
    {},
  );
  const [columns, setColumns] = useState<string[]>([]);
  const [variantData, setVariantData] = useState<Record<string, VariantData>>(
    {},
  );

  const {
    data: { data, metaData },
  } = useSuspenseQuery({
    queryKey: ["allCategories"],
    queryFn: () => actionGetCategories({ rootOnly: true, sort: "name" }),
  });

  // -------------------- ACTIONS --------------------
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
    setShowDropdown(!showDropdown);
  };

  const updateFilter = (level: "root" | "sub" | "subchild", value: string) => {
    setFilters((prev) => ({ ...prev, [level]: value }));
  };

  const toggleValue = (attribute: string, value: string) => {
    setSelections((prev) => {
      const current = prev[attribute] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      const next = { ...prev, [attribute]: updated };

      // Update columns based on filtered keys that still have values
      const newColumnList = Object.keys(next).filter(
        (attr) => next[attr].length > 0,
      );
      setColumns((prevCols) => {
        return prevCols
          .filter((col) => newColumnList.includes(col))
          .concat(newColumnList.filter((col) => !prevCols.includes(col)));
      });

      return next;
    });
  };

  const removeValue = (attribute: string, value: string) => {
    setSelections((prev) => {
      const current = prev[attribute] || [];
      const updated = current.filter((v) => v !== value);
      return { ...prev, [attribute]: updated };
    });
  };

  const combinations = useMemo(() => {
    const entries = Object.entries(selections).filter(
      ([, values]) => values.length > 0,
    );
    if (entries.length === 0) return []; // no attribute values selected
    if (entries.length === 1) {
      return entries[0][1].map((value) => [value]); // map to single-value combos
    }
    return generateCombinations(selections); // default behavior for >1 attribute
  }, [selections]);

  const handleVariantChange = <K extends keyof VariantData>(
    combo: string[],
    field: K,
    value: VariantData[K],
  ) => {
    const key = combo.join("|");
    setVariantData((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [field]: value },
    }));
  };

  const handleImageUpload = (combo: string[], files: FileList) => {
    const key = combo.join("|");
    const filePaths = Array.from(files).map((f) => URL.createObjectURL(f));
    setVariantData((prev) => {
      const existing = prev[key]?.images || [];
      return {
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          images: [...existing, ...filePaths].slice(0, 8),
        },
      };
    });
  };

  const handleImageRemove = (combo: string[], image: string) => {
    const key = combo.join("|");
    setVariantData((prev) => {
      const images = prev[key]?.images?.filter((img) => img !== image) || [];
      return {
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          images,
        },
      };
    });
  };

  const handleReorderColumns = (newOrder: string[]) => {
    setColumns(newOrder);
  };

  const handleSpecificationChange = (key: string, value: string) => {
    setSpecifications((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const newVariantData = { ...variantData };
    let allValid = true;

    combinations.forEach((combo) => {
      const key = combo.join("|");
      const variant = variantData[key] || {};
      const isValid = !!(variant.stock && variant.price && variant.sku);
      newVariantData[key] = { ...variant, isValid };
      if (!isValid) allValid = false;
    });

    setVariantData(newVariantData);

    if (!allValid) {
      alert("Please fill stock, price, and SKU for all variants.");
      return;
    }

    const variants = combinations.map((combo) => {
      const data: Record<string, string> = {};
      columns.forEach((attr) => {
        const key = slugify(attr, { lower: true });
        const attrIndex = columns.indexOf(attr);
        data[key] = combo[attrIndex] || "";
      });

      const variantKey = combo.join("|");
      const variant = variantData[variantKey] || {};
      return {
        ...data,
        stock: variant.stock || "0",
        price: variant.price || "",
        sku: variant.sku || "",
        images: variant.images || [],
        available: variant.available ?? true,
      };
    });

    const name = nameRef.current?.value?.trim();
    const description = descriptionRef.current?.value?.trim();

    if (!name) {
      alert("Product name is required");
      return;
    }

    const payload = {
      name,
      description: description || "",
      category: selectedCategories[2]?.name,
      specifications,
      variants,
    };
    console.log("Submitted payload", payload);
  };

  return {
    showDropdown,
    selectedCategories,
    subCategories,
    subChildCategories,
    specifications,
    filters,
    data,
    metaData,
    nameRef,
    descriptionRef,
    handleSpecificationChange,
    handleShowDropdownChange,
    handleClickRoot,
    handleClickSub,
    handleClickSubChild,
    updateFilter,
    handleSubmit,
    variantState: {
      specifications,
      setSpecifications,
      handleSpecificationChange,
      selections,
      setSelections,
      toggleValue,
      removeValue,
      combinations,
      variantData,
      handleVariantChange,
      handleImageUpload,
      handleImageRemove,
      columns,
      handleReorderColumns,
    },
  };
}
