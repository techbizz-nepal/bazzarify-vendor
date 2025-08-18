import { IMetaData } from "@/modules/core";
import {
  TAttribute,
  TAttributesIndexPayload,
  TCategory,
  TCategoryAncestors,
  TEditProductPayload,
  TProductForm,
} from "@/modules/product.management";
import { actionGetAttributes } from "@/modules/product.management/actions/attribute";
import { actionDelete as actionDeleteImage } from "@/modules/product.management/actions/image";
import { actionUpdateProducts } from "@/modules/product.management/actions/product";
import {
  MAX_PRODUCT_IMAGES_COUNT,
  MAX_VARIANT_IMAGE_COUNT,
} from "@/modules/product.management/config/constants/IMAGE_CONSTANTS";
import { PRODUCT_CRUD_CONSTANTS } from "@/modules/product.management/config/constants/PRODUCT_CRUD_CONSTANTS";
import { UpdateProductSchema } from "@/modules/product.management/config/schemas/product";
import useCategory from "@/modules/product.management/hooks/useCategory";
import useProduct from "@/modules/product.management/hooks/useProduct";
import useVariant from "@/modules/product.management/hooks/useVariant";
import {
  fillSelectedProductVariantData,
  getVariantNameWithUppercase,
} from "@/modules/product.management/utils/editProductUtils";
import {
  appendFormDataVariants,
  createVariantsPayload,
  updateVariantValidity,
} from "@/modules/product.management/utils/productForm";
import { lexicalJsonToHtml } from "@/modules/product.management/utils/richTextEditorUtils";
import { useRouter } from "next/navigation";
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
  const [variantImageIdMap, setVariantImageIdMap] = useState<
    Record<string, Record<string, string>>
  >({});

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
    onExistingVariantImageRemove: async (combo, url) => {
      const key = getVariantNameWithUppercase(combo.join("|"));
      const uuid = variantImageIdMap[key]?.[url];
      if (!uuid) return false;
      const res = await actionDeleteImage({ uuid, storageUrl: url });
      if ("error" in res) {
        toast.error(res.error);
        return false;
      }
      // remove from a local map
      setVariantImageIdMap((prev) => {
        const copy = { ...prev };
        const inner = { ...(copy[key] || {}) };
        delete inner[url];
        copy[key] = inner;
        return copy;
      });
      toast.success("Variant image removed.");
      return true;
    },
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
    existingImageIdMap,
    setExistingImageIdMap,
  } = useProduct();

  // Remove the existing product image via API, then update the local state
  const handleRemoveExistingProductImage = async (
    url: string,
  ): Promise<boolean> => {
    try {
      const uuid = existingImageIdMap[url];
      if (!uuid) {
        toast.error("Could not determine image id.");
        return false;
      }
      const res = await actionDeleteImage({ uuid, storageUrl: url });
      if ("error" in res) {
        toast.error(res.error);
        return false;
      }
      const remaining = (existingProductImages || []).filter((u) => u !== url);
      handleExistingProductImagesChange(remaining);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [url]: _, ...rest } = existingImageIdMap;
      setExistingImageIdMap(rest);
      toast.success("Image removed.");
      return true;
    } catch (e) {
      console.log(e);
      toast.error("Failed to remove image. Please try again.");
      return false;
    }
  };

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
      // Populate existing product images from TImage[] (a file may be relative)
      const imageUrls: string[] = [];
      const idMap: Record<string, string> = {};
      const base = (product.image_base_url || "").replace(/\/+$/, "");
      const toFull = (file: string) =>
        /^(https?:)?\/\//.test(file)
          ? file
          : `${base}/${String(file).replace(/^\/+/, "")}`;
      if (Array.isArray(product.images)) {
        for (const img of product.images as { uuid: string; file: string }[]) {
          const url = toFull(img.file);
          const uuid = img.uuid;
          imageUrls.push(url);
          idMap[url] = uuid;
        }
      }
      // Enforce product image max: only keep up to MAX_PRODUCT_IMAGES_COUNT
      const limitedUrls = imageUrls.slice(0, MAX_PRODUCT_IMAGES_COUNT);
      const limitedIdMap: Record<string, string> = {};
      limitedUrls.forEach((u) => {
        if (idMap[u]) limitedIdMap[u] = idMap[u];
      });
      handleExistingProductImagesChange(limitedUrls);
      setExistingImageIdMap(limitedIdMap);

      const productForm: TProductForm = {
        type: "retail",
        name: product.name,
        uuid: product.uuid,
        description: lexicalJsonToHtml(product.description || undefined),
        box_items: product.box_items || "",
        highlights: lexicalJsonToHtml(product.highlights || undefined),
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
          // Build variant image uuid map
          const map: Record<string, Record<string, string>> = {};
          (product?.variants || []).forEach((v) => {
            const key = getVariantNameWithUppercase(v.name);
            const base = (v.image_base_url || "").replace(/\/+$/, "");
            const toFull = (file: string) =>
              /^(https?:)?\/\//.test(file)
                ? file
                : `${base}/${String(file).replace(/^\/+/, "")}`;
            const imgs = (v.images || []) as unknown[];
            let count = 0;
            for (const img of imgs) {
              if (
                typeof img === "object" &&
                img !== null &&
                "file" in (img as Record<string, unknown>) &&
                typeof (img as { file?: unknown }).file === "string" &&
                "uuid" in (img as Record<string, unknown>) &&
                typeof (img as { uuid?: unknown }).uuid === "string"
              ) {
                if (count >= MAX_VARIANT_IMAGE_COUNT) break;
                const file = (img as { file: string }).file;
                const url = toFull(file);
                const uuid = (img as { uuid: string }).uuid;
                if (!map[key]) map[key] = {};
                map[key][url] = uuid;
                count += 1;
              }
            }
          });
          setVariantImageIdMap(map);
        },
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickSubChildOnUpdate: (
    category: TCategory,
  ) => Promise<TAttribute[] | undefined> = async (category: TCategory) => {
    setSelectedCategories((prev) => [prev[0], prev[1], category]);
    const promises: [IMetaData | TAttributesIndexPayload] = await Promise.all([
      actionGetAttributes({
        uuids: category.attributes?.join(","),
      }),
    ]);

    // You can now destructure the responses from the promise array
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

  const router = useRouter();

  const handleUpdate: () => Promise<void> = async () => {
    if (!productForm?.uuid) {
      toast.error("Cannot proceed request.");
      return;
    }
    if (!existingProductImages.length && !uploadedProductImages.length) {
      toast.error("Please select product image.");
      return;
    }
    // Validate base product fields
    const validation: ZodSafeParseResult<TProductForm> =
      UpdateProductSchema.safeParse({
        type: "retail",
        uuid: productForm.uuid,
        category: selectedCategories.at(2)?.uuid,
        name: productForm.name,
        base_price: String(productForm.base_price),
        description: productForm.description,
        highlights: productForm.highlights,
        box_items: productForm.box_items,
      });
    if (!validation.success) {
      validation.error.issues.forEach((error) => toast.error(error.message));
      return;
    }

    // Validate variants like create flow
    const { updated, allValid } = updateVariantValidity(
      combinations,
      variantData,
    );
    if (!allValid) {
      toast.error("Please fill stock, price, SKU, images for variants.");
      return;
    }
    setVariantData(updated);
    const variants = createVariantsPayload(combinations, columns, updated);

    // Build FormData (only new images will be appended)
    const formData = new FormData();

    // Append validated product fields
    const { ...rest } = validation.data;

    Object.entries(rest).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    // Product images: append only newly uploaded files
    uploadedProductImages.forEach((img) => formData.append("images[]", img));

    // Specifications
    Object.entries(selectedSpecifications || {}).forEach(([key, value]) => {
      formData.append(`specifications[${key}]`, value);
    });

    // Variants + attributes (only File images are appended inside util)
    appendFormDataVariants(formData, variants, columns, categoryAttributes);
    toast.info("Updating product...");
    const res = await actionUpdateProducts(formData, productForm.uuid);
    if ("error" in res) {
      toast.error(`${res.error}`);
      return;
    }
    toast.success(PRODUCT_CRUD_CONSTANTS.updateProductSuccess);
    router.replace("/products");
  };
  return {
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
    handleRemoveExistingProductImage,
  };
}
