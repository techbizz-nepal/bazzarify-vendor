import { IMetaData } from "@/modules/core";
import {
  TAttribute,
  TAttributesIndexPayload,
  TCategory,
  TCategoryAncestors,
  TEditProductPayload,
  TProduct,
  TProductForm,
} from "@/modules/product.management";
import { actionGetAttributes } from "@/modules/product.management/actions/attribute";
import { UpdateProductSchema } from "@/modules/product.management/config/schemas/product";
import useCategory from "@/modules/product.management/hooks/useCategory";
import useProduct from "@/modules/product.management/hooks/useProduct";
import useVariant from "@/modules/product.management/hooks/useVariant";
import { fillSelectedProductVariantData } from "@/modules/product.management/utils/editProductUtils";
import { lexicalJsonToHtml } from "@/modules/product.management/utils/richTextEditorUtils";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { ZodSafeParseResult } from "zod";

export default function useUpdateProduct(
  productPayloadPromise: Promise<TEditProductPayload | IMetaData>,
) {
  const [categoryAttributes, setCategoryAttributes] = useState<TAttribute[]>(
    [],
  );
  const [variantSelections, setVariantSelections] = useState<
    Record<string, string[]>
  >({});
  const [selectedSpecifications, setSelectedSpecifications] = useState<
    Record<string, string>
  >({});
  const [product, setProduct] = useState<TProduct>();

  const {
    showDropdown: showCategoryDropdown,
    handleShowDropdownChange: handleCategoryDropdownChange,
    filters,
    subCategories,
    subChildCategories,
    handleClickSub,
    handleClickRoot,
    updateFilter,
    selectedCategories,
    setSelectedCategories,
    categorySpecifications,
    handleSpecificationChange,
  } = useCategory({
    setCategoryAttributes,
  });

  const {
    toggleValue,
    removeValue,
    columns,
    setColumns,
    combinations,
    variantData,
    handleImageUpload,
    handleImageRemove,
    handleVariantChange,
    setVariantData,
  } = useVariant({
    variantSelections,
    setVariantSelections,
  });
  const {
    nameRef,
    basePriceRef,
    existingProductImages,
    handleProductImageUpload,
    handleExistingProductImagesChange,
    productBoxItemsRef,
    productDescriptionRef,
    productHighlightsRef,
    uploadedProductImages,
    productForm,
    handleProductForm,
    setProductForm,
  } = useProduct();

  const onProductFormInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    handleProductForm(e.target.name as keyof TProductForm, e.target.value);
  };

  useEffect(() => {
    productPayloadPromise.then((editProductPayload) => {
      if ("error" in editProductPayload) {
        toast.error(editProductPayload.error);
        return;
      }
      const { product } = editProductPayload;

      const productForm: TProductForm = {
        type: "retail",
        name: product.name,
        uuid: product.uuid,
        description: lexicalJsonToHtml(product.description),
        box_items: product.box_items || "",
        highlights: lexicalJsonToHtml(product.highlights),
        base_price: product.base_price,
      };
      setProductForm(productForm);
      setSelectedSpecifications(
        JSON.parse(product.specifications?.toString() || "{}"),
      );
      const categoryAncestors: TCategoryAncestors =
        editProductPayload.categoryAncestors;
      setSelectedCategories([categoryAncestors.root, categoryAncestors.sub]);
      handleClickSubChildOnUpdate(categoryAncestors.subChild).then(
        (attributes) => {
          if (!attributes || !attributes.length) return;
          fillSelectedProductVariantData({
            setVariantData,
            setVariantSelections,
            setColumns,
            selectedProductVariants: product?.variants,
            categoryAttributes: attributes,
          });
        },
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //write return type of this method
  const handleClickSubChildOnUpdate: (
    category: TCategory,
  ) => Promise<TAttribute[] | undefined> = async (category: TCategory) => {
    setSelectedCategories((prev) => [prev[0], prev[1], category]);
    const promises: [IMetaData | TAttributesIndexPayload] = await Promise.all([
      actionGetAttributes({
        uuids: category.attributes?.join(","),
      }),
    ]);

    // You can now destructure the responses from the promises array
    const [attributesResponse] = promises;
    if ("error" in attributesResponse) {
      toast.error("Oops, something went wrong while fetching data!");
      return;
    }

    const attributesData = attributesResponse.attributes?.data;
    if (attributesData) {
      setCategoryAttributes(attributesData);
    }
    return attributesData;
  };

  const handleUpdate: () => Promise<void> = async () => {
    if (!productForm?.uuid) {
      toast.error("Cannot proceed request.");
      return;
    }
    const validation: ZodSafeParseResult<TProductForm> =
      UpdateProductSchema.safeParse({
        type: "retail",
        uuid: productForm.uuid,
        name: productForm.name,
        base_price: productForm.base_price.toString(),
        description: productForm.description,
        highlights: productForm.highlights,
        box_items: productForm.box_items,
      });
    if (!validation.success) {
      console.log(validation.error.message);
      validation.error.issues.forEach((error) => toast.error(error.message));
      return;
    }
    console.log(validation.data);
  };
  return {
    product,
    showCategoryDropdown,
    filters,
    subCategories,
    subChildCategories,
    handleCategoryDropdownChange,
    handleClickSub,
    handleClickSubChild: handleClickSubChildOnUpdate,
    handleClickRoot,
    updateFilter,
    selectedCategories,
    categorySpecifications,
    handleSpecificationChange,
    selectedSpecifications,
    selectorState: {
      attributes: categoryAttributes,
      toggleValue,
      removeValue,
      variantSelections,
    },
    variantState: {
      columns: columns,
      variantData,
      combinations,
      setVariantSelections,
      handleVariantChange,
      handleImageUpload,
      handleImageRemove,
    },
    productForm,
    onProductFormInputChange,
    nameRef,
    basePriceRef,
    existingProductImages,
    handleProductImageUpload,
    handleExistingProductImagesChange,
    productBoxItemsRef,
    productDescriptionRef,
    productHighlightsRef,
    uploadedProductImages,
    handleUpdate,
  };
}
