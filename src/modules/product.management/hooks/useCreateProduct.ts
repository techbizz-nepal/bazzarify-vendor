import {
  TAttribute,
  TCategory,
  TSpecification,
  VariantData,
} from "@/modules/product.management";
import { actionGetAttributes } from "@/modules/product.management/actions/attribute";
import { actionGetCategories } from "@/modules/product.management/actions/category";
import { actionStoreProducts } from "@/modules/product.management/actions/product";
import { actionGetSpecifications } from "@/modules/product.management/actions/specification";
import generateCombinations from "@/modules/product.management/utils/generateCombinations";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import slugify from "slugify";
import { toast } from "sonner";

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
  const [categorySpecifications, setCategorySpecifications] = useState<
    TSpecification[]
  >([]);
  const [categoryAttributes, setCategoryAttributes] = useState<TAttribute[]>(
    [],
  );
  const [columns, setColumns] = useState<string[]>([]);
  const [variantData, setVariantData] = useState<Record<string, VariantData>>(
    {},
  );

  const { data } = useQuery({
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

  const handleClickSubChild = async (category: TCategory) => {
    setSelectedCategories((prev) => [prev[0], prev[1], category]);
    try {
      const promises = await Promise.all([
        actionGetSpecifications({
          uuids: category.specifications.join(","),
        }),
        actionGetAttributes({
          uuids: category.attributes.join(","),
        }),
      ]);

      // You can now destructure the responses from the promises array
      const [specificationsResponse, attributesResponse] = promises;

      if (
        specificationsResponse.metaData.error ||
        attributesResponse.metaData.error
      ) {
        toast.error("Oops, something went wrong while fetching data!");
        return;
      }

      const specificationsData = specificationsResponse.data.payload
        .specifications?.data as TSpecification[];
      if (specificationsData) {
        setCategorySpecifications(specificationsData);
        setSpecifications({});
      }

      const attributesData = attributesResponse.data.payload.attributes
        ?.data as TAttribute[];
      if (attributesData) {
        setCategoryAttributes(attributesData);
        setSelections({});
      }
    } catch (error: unknown) {
      console.error("Error fetching specifications and attributes:", error);
      toast.error("Oops, an error occurred while fetching data!");
    } finally {
      setShowDropdown(!showDropdown);
    }
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
    const fileList = Array.from(files).filter((file) => file instanceof File);
    setVariantData((prev) => {
      const existing = (prev[key]?.images || []).filter(
        (img) => img instanceof File,
      );
      return {
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          images: [...existing, ...fileList].slice(0, 3),
        },
      };
    });
  };

  const handleImageRemove = (combo: string[], image: File) => {
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
  const handleProductImageUpload = (files: File[]) => {
    console.log("handleProductImageUpload", files);
  };
  const handleSubmit = async () => {
    const newVariantData = { ...variantData };
    let validStock = true;

    combinations.forEach((combo) => {
      const key = combo.join("|");
      const variant = variantData[key] || {};
      const isValid = !!(
        variant.stock &&
        variant.price &&
        variant.sku &&
        variant.images
      );
      newVariantData[key] = { ...variant, isValid };
      if (!isValid) validStock = false;
    });

    setVariantData(newVariantData);

    if (!validStock) {
      toast.error("Please fill stock, price, SKU, images for variants.");
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
        name: variantKey.toLowerCase(),
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
      toast.error("Product name is required");
      return;
    }
    if (!description) {
      toast.error("Product description is required");
      return;
    }
    if (!variants.length) {
      toast.error("Select least one variant");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description || "");
    formData.append("category", selectedCategories[2]?.uuid);
    for (const key in specifications) {
      formData.append(`specifications[${key}]`, specifications[key]);
    }
    if (Object.keys(specifications).length === 0) {
      toast.error("Please fill specifications");
      return;
    }
    variants.forEach((variant, variantIndex) => {
      columns.forEach((attr) => {
        const key = slugify(attr, { lower: true });
        const attributeValue = categoryAttributes
          .filter((attr) => attr.name === key)[0]
          .attribute_value.filter(
            (values) => values.label === (variant as never)[key],
          )[0];
        formData.append(
          `variants[${variantIndex}][attribute][${key}|${(variant as never)[key]}][attributeUuid]`,
          attributeValue.attribute_uuid,
        );
        formData.append(
          `variants[${variantIndex}][attribute][${key}|${(variant as never)[key]}][attributeValueUuid]`,
          attributeValue.uuid,
        );
        // formData.append(
        //   `variants[${variantIndex}][${key}]`,
        //   (variant as never)[key] || "",
        // );
      });
      formData.append(`variants[${variantIndex}][name]`, variant.name);
      formData.append(`variants[${variantIndex}][stock]`, variant.stock);
      formData.append(`variants[${variantIndex}][price]`, variant.price);
      formData.append(`variants[${variantIndex}][sku]`, variant.sku);
      formData.append(
        `variants[${variantIndex}][available]`,
        variant.available ? "1" : "0",
      );

      variant.images.forEach((image, imageIndex) => {
        formData.append(
          `variants[${variantIndex}][images][${imageIndex}]`,
          image,
        );
      });
    });

    actionStoreProducts(formData)
      .then((res) => {
        if (res.data.metaData.error) {
          toast.error(res.data.metaData);
          return;
        }
        redirect("/products");
      })
      .catch((err) => {
        toast.error("Error Submitted payload", err);
      });
  };

  return {
    showDropdown,
    selectedCategories,
    subCategories,
    subChildCategories,
    specifications,
    categorySpecifications,
    categoryAttributes,
    filters,
    handleProductImageUpload,
    responseData: data,
    nameRef,
    descriptionRef,
    handleShowDropdownChange,
    handleClickRoot,
    handleClickSub,
    handleClickSubChild,
    updateFilter,
    handleSubmit,
    setSpecifications,
    handleSpecificationChange,
    variantState: {
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
