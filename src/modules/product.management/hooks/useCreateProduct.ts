import {
  TAttribute,
  TProductForm,
} from "@/modules/product.management";
import { actionStoreProducts } from "@/modules/product.management/actions/product";
import { PRODUCT_CRUD_CONSTANTS } from "@/modules/product.management/config/constants/PRODUCT_CRUD_CONSTANTS";
import { CreateProductSchema } from "@/modules/product.management/config/schemas/product";
import useCategory from "@/modules/product.management/hooks/useCategory";
import useProduct from "@/modules/product.management/hooks/useProduct";
import useVariant from "@/modules/product.management/hooks/useVariant";
import { prepareProductSubmission } from "@/modules/product.management/utils/productAuthoring";
import { AxiosError } from "axios";
import { omit } from "lodash-es";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

export default function useCreateProduct() {
  const router = useRouter();
  const [categoryAttributes, setCategoryAttributes] = useState<TAttribute[]>(
    [],
  );
  const [variantSelections, setVariantSelections] = useState<
    Record<string, string[]>
  >({});

  const {
    nameRef,
    basePriceRef,
    existingProductImages,
    handleProductImageUpload,
    productBoxItemsRef,
    productDescriptionRef,
    productHighlightsRef,
    uploadedProductImages,
    productForm,
    handleProductForm,
  } = useProduct();

  const {
    categorySpecifications,
    filters,
    handleClickRoot,
    handleClickSub,
    handleShowDropdownChange,
    selectedCategories,
    showDropdown,
    specifications,
    subCategories,
    subChildCategories,
    updateFilter,
    handleClickSubChild,
    setSpecifications,
    handleSpecificationChange,
  } = useCategory({
    setCategoryAttributes,
    setVariantSelections,
  });

  const {
    columns,
    variantData,
    combinations,
    handleImageRemove,
    handleImageUpload,
    handleReorderColumns,
    handleVariantChange,
    removeValue,
    setVariantData,
    toggleValue,
  } = useVariant({ variantSelections, setVariantSelections });

  const onProductFormInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    handleProductForm(e.target.name as keyof TProductForm, e.target.value);
  };

  const handleSubmit: () => Promise<void> = async () => {
    const submission = prepareProductSubmission({
      schema: CreateProductSchema,
      product: omit(productForm, "uuid"),
      selectedCategoryUuid: selectedCategories.at(2)?.uuid,
      combinations,
      columns,
      variantData,
      uploadedProductImages,
      specifications,
      categoryAttributes,
    });
    setVariantData(submission.updatedVariantData);
    if (!submission.ok) {
      toast.error(submission.message);
      return;
    }

    toast.info("Uploading product...");
    actionStoreProducts(submission.formData)
      .then((res) => {
        if ("error" in res) {
          toast.error(`${res.error}`);
          return;
        }
        toast.success(PRODUCT_CRUD_CONSTANTS.createProductSuccess);
        router.replace("/products");
        return;
      })
      .catch((err) => {
        console.log(typeof err);
        if (err instanceof AxiosError) {
          console.log(err);
        }
        toast.error("Please contact support. ", err);
      });
  };

  return {
    showDropdown,
    selectedCategories,
    subCategories,
    subChildCategories,
    specifications,
    existingProductImages,
    categorySpecifications,
    filters,
    handleProductImageUpload,
    nameRef,
    basePriceRef,
    productDescriptionRef,
    productHighlightsRef,
    productBoxItemsRef,
    productForm,
    onProductFormInputChange,
    handleShowDropdownChange,
    handleClickRoot,
    handleClickSub,
    handleClickSubChild,
    updateFilter,
    handleSubmit,
    setSpecifications,
    handleSpecificationChange,
    selectorState: {
      attributes: categoryAttributes,
      toggleValue,
      removeValue,
      variantSelections,
    },
    variantState: {
      variantSelections,
      setVariantSelections,
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
