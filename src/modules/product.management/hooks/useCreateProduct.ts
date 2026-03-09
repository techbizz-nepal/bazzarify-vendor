import { toTitleCase } from "@/modules/core/utils";
import {
  TAttribute,
  TProductForm,
  TVariantPayload,
} from "@/modules/product.management";
import { actionStoreProducts } from "@/modules/product.management/actions/product";
import { PRODUCT_CRUD_CONSTANTS } from "@/modules/product.management/config/constants/PRODUCT_CRUD_CONSTANTS";
import { CreateProductSchema } from "@/modules/product.management/config/schemas/product";
import useCategory from "@/modules/product.management/hooks/useCategory";
import useProduct from "@/modules/product.management/hooks/useProduct";
import useVariant from "@/modules/product.management/hooks/useVariant";
import {
  appendFormDataVariants,
  createVariantsPayload,
  updateVariantValidity,
} from "@/modules/product.management/utils/productForm";
import { AxiosError } from "axios";
import { omit } from "lodash-es";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import { fromZodIssues } from "@/modules/core/lib/utils.validationFeedback";

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
    const productFormData = omit(productForm, "uuid");
    const { updated, allValid } = updateVariantValidity(
      combinations,
      variantData,
    );

    if (!allValid) {
      toast.error("Please fill stock, price, SKU, images for variants.");
      return;
    }
    setVariantData(updated);

    const variants: TVariantPayload[] = createVariantsPayload(
      combinations,
      columns,
      updated,
    );

    const productFormValidation = CreateProductSchema.safeParse({
      ...productFormData,
      category: selectedCategories.at(2)?.uuid,
      variants: [...variants],
    });
    if (!productFormValidation.success) {
      const feedback = fromZodIssues(productFormValidation.error.issues);
      const firstFieldError = Object.entries(feedback.fieldErrors)[0];
      if (firstFieldError) {
        const [path, messages] = firstFieldError;
        toast.error(
          `${toTitleCase(path.replaceAll(".", ", ").replaceAll("_", " "))}: ${messages[0]}`,
        );
      } else {
        toast.error(feedback.summary);
      }

      return;
    }

    const formData = new FormData();

    Object.entries(omit(productFormValidation.data, "variants")).forEach(
      ([key, value]) => formData.append(key, String(value)),
    );
    uploadedProductImages.forEach((img) => formData.append("images[]", img));
    Object.entries(specifications).forEach(([key, value]) =>
      formData.append(`specifications[${key}]`, value),
    );

    appendFormDataVariants(formData, variants, columns, categoryAttributes);

    toast.info("Uploading product...");
    actionStoreProducts(formData)
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
