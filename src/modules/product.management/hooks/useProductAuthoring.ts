import { IMetaData } from "@/modules/core";
import {
  ProductAuthoringController,
  TAttribute,
  TCategory,
  TEditProductPayload,
  TProductForm,
  TVariantDataMap,
} from "@/modules/product.management";
import { actionDelete as actionDeleteImage } from "@/modules/product.management/actions/image";
import {
  actionStoreProducts,
  actionUpdateProducts,
} from "@/modules/product.management/actions/product";
import {
  MAX_PRODUCT_IMAGES_COUNT,
  MAX_VARIANT_IMAGE_COUNT,
} from "@/modules/product.management/config/constants/IMAGE_CONSTANTS";
import { PRODUCT_CRUD_CONSTANTS } from "@/modules/product.management/config/constants/PRODUCT_CRUD_CONSTANTS";
import {
  CreateProductSchema,
  UpdateProductSchema,
} from "@/modules/product.management/config/schemas/product";
import useCategory from "@/modules/product.management/hooks/useCategory";
import useProduct from "@/modules/product.management/hooks/useProduct";
import useVariant from "@/modules/product.management/hooks/useVariant";
import { fillSelectedProductVariantData } from "@/modules/product.management/utils/editProductUtils";
import { lexicalJsonToHtml } from "@/modules/product.management/utils/richTextEditorUtils";
import {
  createVariantDraftKey,
  resolveVariantOptionValuesFromAttributes,
} from "@/modules/product.management/utils/variantDraft";
import {
  loadProductCategoryContext,
  prepareProductSubmission,
} from "@/modules/product.management/utils/productAuthoring";
import { omit } from "lodash-es";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

type ProductAuthoringMode = "create" | "update";

interface UseProductAuthoringOptions {
  mode: ProductAuthoringMode;
  productPayloadPromise?: Promise<TEditProductPayload | IMetaData>;
}

export default function useProductAuthoring({
  mode,
  productPayloadPromise,
}: UseProductAuthoringOptions): ProductAuthoringController {
  const router = useRouter();
  const [categoryAttributes, setCategoryAttributes] = useState<TAttribute[]>(
    [],
  );
  const [variantSelections, setVariantSelections] = useState<
    Record<string, string[]>
  >({});
  const [specificationValues, setSpecificationValues] = useState<
    Record<string, string>
  >({});
  const [variantImageIdMap, setVariantImageIdMap] = useState<
    Record<string, Record<string, string>>
  >({});
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    summary: string;
    fieldErrors: Record<string, string[]>;
  } | null>(null);

  const product = useProduct();
  const category = useCategory({
    setCategoryAttributes,
    setVariantSelections,
  });
  const variant = useVariant({
    variantSelections,
    setVariantSelections,
    onExistingVariantImageRemove: async (combo, url) => {
      const key = createVariantDraftKey(combo);
      const uuid = variantImageIdMap[key]?.[url];
      if (!uuid) return false;

      const response = await actionDeleteImage({ uuid, storageUrl: url });
      if ("error" in response) {
        toast.error(response.error);
        return false;
      }

      setVariantImageIdMap((previousMap) => {
        const nextMap = { ...previousMap };
        const imageMap = { ...(nextMap[key] || {}) };
        delete imageMap[url];
        nextMap[key] = imageMap;
        return nextMap;
      });

      toast.success("Variant image removed.");
      return true;
    },
  });

  const resetDraftForCategoryChange = () => {
    setSpecificationValues({});
    setSubmissionFeedback(null);
    setVariantImageIdMap({});
    variant.setVariantData({});
    variant.setColumns([]);
  };

  const onProductFormInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setSubmissionFeedback(null);
    product.handleProductForm(
      event.target.name as keyof TProductForm,
      event.target.value,
    );
  };

  const handleSpecificationChange = (key: string, value: string) => {
    setSubmissionFeedback(null);
    setSpecificationValues((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleClickSubChild = async (categoryLeaf: TCategory) => {
    await category.handleClickSubChild(categoryLeaf);
    resetDraftForCategoryChange();
  };

  const handleRemoveExistingProductImage = async (
    url: string,
  ): Promise<boolean> => {
    try {
      const uuid = product.existingImageIdMap[url];
      if (!uuid) {
        toast.error("Could not determine image id.");
        return false;
      }

      const response = await actionDeleteImage({ uuid, storageUrl: url });
      if ("error" in response) {
        toast.error(response.error);
        return false;
      }

      const remainingImages = (product.existingProductImages || []).filter(
        (imageUrl) => imageUrl !== url,
      );
      product.handleExistingProductImagesChange(remainingImages);
      const { [url]: removedImageUuid, ...restImageIdMap } =
        product.existingImageIdMap;
      void removedImageUuid;
      product.setExistingImageIdMap(restImageIdMap);
      toast.success("Image removed.");
      return true;
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove image. Please try again.");
      return false;
    }
  };

  useEffect(() => {
    if (mode !== "update" || !productPayloadPromise) {
      return;
    }

    productPayloadPromise.then((editProductPayload) => {
      if ("error" in editProductPayload) {
        toast.error(editProductPayload.error);
        return;
      }

      hydrateEditProduct({
        editProductPayload,
        setProductForm: product.setProductForm,
        handleExistingProductImagesChange: product.handleExistingProductImagesChange,
        setExistingImageIdMap: product.setExistingImageIdMap,
        setSelectedCategories: category.setSelectedCategories,
        setSelectedSpecifications: setSpecificationValues,
        setVariantData: variant.setVariantData,
        setVariantSelections,
        setColumns: variant.setColumns,
        setVariantImageIdMap,
        handleLoadCategoryContext: async (leafCategory) => {
          category.setSelectedCategories((previous) => [
            previous[0],
            previous[1],
            leafCategory,
          ]);
          const categoryContext = await loadProductCategoryContext(leafCategory);
          if ("error" in categoryContext) {
            toast.error(categoryContext.error);
            return;
          }

          setCategoryAttributes(categoryContext.attributes);
          category.setCategorySpecifications(categoryContext.specifications);
          return categoryContext.attributes;
        },
      });
    });
  }, [
    category,
    mode,
    product.handleExistingProductImagesChange,
    product.setExistingImageIdMap,
    product.setProductForm,
    productPayloadPromise,
    variant.setColumns,
    variant.setVariantData,
  ]);

  const handleSubmit = async () => {
    if (
      mode === "update" &&
      (!product.productForm.uuid ||
        (!product.existingProductImages.length &&
          !product.uploadedProductImages.length))
    ) {
      toast.error(
        product.productForm.uuid
          ? "Please select product image."
          : "Cannot proceed request.",
      );
      return;
    }

    const submission =
      mode === "create"
        ? prepareProductSubmission({
            schema: CreateProductSchema,
            product: omit(product.productForm, "uuid"),
            productSku: product.productForm.sku,
            selectedCategoryUuid: category.selectedCategories.at(2)?.uuid,
            combinations: variant.combinations,
            columns: variant.columns,
            variantData: variant.variantData,
            uploadedProductImages: product.uploadedProductImages,
            specifications: specificationValues,
            categoryAttributes,
          })
        : prepareProductSubmission({
            schema: UpdateProductSchema,
            product: {
              type: "retail",
              uuid: product.productForm.uuid,
              sku: product.productForm.sku,
              name: product.productForm.name,
              base_price: String(product.productForm.base_price),
              description: product.productForm.description,
              highlights: product.productForm.highlights,
              box_items: product.productForm.box_items,
            },
            productSku: product.productForm.sku,
            selectedCategoryUuid: category.selectedCategories.at(2)?.uuid,
            combinations: variant.combinations,
            columns: variant.columns,
            variantData: variant.variantData,
            uploadedProductImages: product.uploadedProductImages,
            specifications: specificationValues,
            categoryAttributes,
          });

    variant.setVariantData(submission.updatedVariantData);
    if (!submission.ok) {
      setSubmissionFeedback(submission.feedback);
      toast.error(submission.feedback.summary);
      return;
    }

    setSubmissionFeedback(null);
    toast.info(mode === "create" ? "Uploading product..." : "Updating product...");

    const response =
      mode === "create"
        ? await actionStoreProducts(submission.formData)
        : await actionUpdateProducts(
            submission.formData,
            product.productForm.uuid as string,
          );

    if ("error" in response) {
      toast.error(response.error);
      return;
    }

    toast.success(
      mode === "create"
        ? PRODUCT_CRUD_CONSTANTS.createProductSuccess
        : PRODUCT_CRUD_CONSTANTS.updateProductSuccess,
    );
    router.replace("/products");
  };

  return {
    basicState: {
      productForm: product.productForm,
      onProductFormInputChange,
    },
    categoryState: {
      showDropdown: category.showDropdown,
      selectedCategories: category.selectedCategories,
      subCategories: category.subCategories,
      subChildCategories: category.subChildCategories,
      filters: category.filters,
      handleShowDropdownChange: category.handleShowDropdownChange,
      handleClickRoot: category.handleClickRoot,
      handleClickSub: category.handleClickSub,
      handleClickSubChild,
      updateFilter: category.updateFilter,
    },
    mediaState: {
      existingProductImages: product.existingProductImages,
      handleProductImageUpload: product.handleProductImageUpload,
      handleExistingProductImagesChange: product.handleExistingProductImagesChange,
      handleRemoveExistingProductImage:
        mode === "update" ? handleRemoveExistingProductImage : undefined,
    },
    specificationState: {
      categorySpecifications: category.categorySpecifications,
      specificationValues,
      handleSpecificationChange,
    },
    selectorState: {
      attributes: categoryAttributes,
      toggleValue: variant.toggleValue,
      removeValue: variant.removeValue,
      variantSelections,
    },
    variantState: {
      setVariantSelections,
      combinations: variant.combinations,
      variantData: variant.variantData,
      handleVariantChange: variant.handleVariantChange,
      handleImageUpload: variant.handleImageUpload,
      handleImageRemove: variant.handleImageRemove,
      columns: variant.columns,
      handleReorderColumns: variant.handleReorderColumns,
    },
    submissionState: {
      feedback: submissionFeedback,
      handleSubmit,
    },
  };
}

interface HydrateEditProductArgs {
  editProductPayload: TEditProductPayload;
  setProductForm: (productForm: TProductForm) => void;
  handleExistingProductImagesChange: (images: string[]) => void;
  setExistingImageIdMap: (imageIdMap: Record<string, string>) => void;
  setSelectedCategories: Dispatch<SetStateAction<TCategory[]>>;
  setSelectedSpecifications: (specifications: Record<string, string>) => void;
  setVariantData: Dispatch<SetStateAction<TVariantDataMap>>;
  setVariantSelections: Dispatch<SetStateAction<Record<string, string[]>>>;
  setColumns: Dispatch<SetStateAction<string[]>>;
  setVariantImageIdMap: (
    value: Record<string, Record<string, string>>,
  ) => void;
  handleLoadCategoryContext: (
    leafCategory: TCategory,
  ) => Promise<TAttribute[] | undefined>;
}

function hydrateEditProduct({
  editProductPayload,
  setProductForm,
  handleExistingProductImagesChange,
  setExistingImageIdMap,
  setSelectedCategories,
  setSelectedSpecifications,
  setVariantData,
  setVariantSelections,
  setColumns,
  setVariantImageIdMap,
  handleLoadCategoryContext,
}: HydrateEditProductArgs) {
  const { product } = editProductPayload;
  const imageUrls: string[] = [];
  const imageIdMap: Record<string, string> = {};
  const imageBaseUrl = (product.image_base_url || "").replace(/\/+$/, "");
  const toFullImageUrl = (file: string) =>
    /^(https?:)?\/\//.test(file)
      ? file
      : `${imageBaseUrl}/${String(file).replace(/^\/+/, "")}`;

  if (Array.isArray(product.images)) {
    for (const image of product.images as { uuid: string; file: string }[]) {
      const imageUrl = toFullImageUrl(image.file);
      imageUrls.push(imageUrl);
      imageIdMap[imageUrl] = image.uuid;
    }
  }

  const existingProductImages = imageUrls.slice(0, MAX_PRODUCT_IMAGES_COUNT);
  const existingImageIdMap: Record<string, string> = {};
  existingProductImages.forEach((imageUrl) => {
    if (imageIdMap[imageUrl]) {
      existingImageIdMap[imageUrl] = imageIdMap[imageUrl];
    }
  });

  handleExistingProductImagesChange(existingProductImages);
  setExistingImageIdMap(existingImageIdMap);
  setProductForm({
    type: "retail",
    sku: product.sku,
    name: product.name,
    uuid: product.uuid,
    description: lexicalJsonToHtml(product.description || undefined),
    box_items: product.box_items || "",
    highlights: lexicalJsonToHtml(product.highlights || undefined),
    base_price: product.base_price,
  });
  setSelectedSpecifications(product.specifications);

  const categoryAncestors = editProductPayload.categoryAncestors;
  setSelectedCategories([categoryAncestors.root, categoryAncestors.sub]);
  handleLoadCategoryContext(categoryAncestors.subChild).then((attributes) => {
    if (!attributes || !attributes.length) {
      return;
    }

    fillSelectedProductVariantData({
      setVariantData: setVariantData as never,
      setVariantSelections,
      setColumns,
      selectedProductVariants: product.variants,
      categoryAttributes: attributes,
    });

    const nextVariantImageIdMap: Record<string, Record<string, string>> = {};
    product.variants.forEach((existingVariant) => {
      const key = createVariantDraftKey(
        resolveVariantOptionValuesFromAttributes(attributes, existingVariant),
      );
      const variantBaseUrl = (existingVariant.image_base_url || "").replace(
        /\/+$/,
        "",
      );
      const toFullVariantImageUrl = (file: string) =>
        /^(https?:)?\/\//.test(file)
          ? file
          : `${variantBaseUrl}/${String(file).replace(/^\/+/, "")}`;
      const images = existingVariant.images || [];
      let count = 0;

      for (const image of images as unknown[]) {
        if (
          typeof image === "object" &&
          image !== null &&
          "file" in (image as Record<string, unknown>) &&
          typeof (image as { file?: unknown }).file === "string" &&
          "uuid" in (image as Record<string, unknown>) &&
          typeof (image as { uuid?: unknown }).uuid === "string"
        ) {
          if (count >= MAX_VARIANT_IMAGE_COUNT) {
            break;
          }
          const file = (image as { file: string }).file;
          const imageUrl = toFullVariantImageUrl(file);
          const uuid = (image as { uuid: string }).uuid;
          if (!nextVariantImageIdMap[key]) {
            nextVariantImageIdMap[key] = {};
          }
          nextVariantImageIdMap[key][imageUrl] = uuid;
          count += 1;
        }
      }
    });

    setVariantImageIdMap(nextVariantImageIdMap);
  });
}
