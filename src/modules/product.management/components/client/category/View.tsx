"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getValidationFeedback } from "@/modules/core/lib/utils.validationFeedback";
import {
  IPaginatedData,
  TCategory,
  TSpecification,
} from "@/modules/product.management";
import { actionGetAttributes } from "@/modules/product.management/actions/attribute";
import {
  actionUpdateCategory,
  actionUploadCategoryImage,
  actionViewCategory,
} from "@/modules/product.management/actions/category";
import { actionGetSpecifications } from "@/modules/product.management/actions/specification";
import CategoryAttributesCard from "@/modules/product.management/ui/CategoryAttributesCard";
import CategoryCard from "@/modules/product.management/ui/CategoryCard";
import CategorySpecificationsCard from "@/modules/product.management/ui/CategorySpecificationsCard";
import { keepPreviousData, useQueries } from "@tanstack/react-query";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const isSquareImage = (file: File): Promise<boolean> =>
  new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image.width === image.height);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(false);
    };

    image.src = objectUrl;
  });

function CategoryImagePanel({
  category,
  isLoading = false,
  onUploaded,
}: {
  category?: TCategory;
  isLoading?: boolean;
  onUploaded: (next: TCategory) => void;
}) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const replacePreviewUrl = (url: string | null) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    previewUrlRef.current = url;
    setPreviewUrl(url);
  };

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const currentImageUrl =
    category?.image_base_url ?? category?.icon_base_url ?? null;
  const currentImageLabel = isLoading
    ? "Loading category image"
    : category?.image_base_url
      ? "Current category image"
      : "No category image";
  const initials = category?.name
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    setImageError(null);

    if (!file) {
      setSelectedImage(null);
      replacePreviewUrl(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setImageError("Select an image file.");
      setSelectedImage(null);
      replacePreviewUrl(null);
      return;
    }

    const validRatio = await isSquareImage(file);
    if (!validRatio) {
      setImageError(
        "Category images must use a square ratio to match the app placeholder.",
      );
      setSelectedImage(null);
      replacePreviewUrl(null);
      return;
    }

    setSelectedImage(file);
    replacePreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = () => {
    if (!category) {
      return;
    }

    if (!selectedImage) {
      setImageError("Choose an image before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    setIsSubmitting(true);
    void actionUploadCategoryImage(category.slug, formData).then((result) => {
      setIsSubmitting(false);

      if (result && "data" in result && result.data.message === "success") {
        const nextCategory = result.data.payload.category as TCategory;
        setSelectedImage(null);
        replacePreviewUrl(null);
        setImageError(null);
        onUploaded(nextCategory);
        toast.success("Category image updated successfully.");
        return;
      }

      const feedback =
        result &&
        typeof result === "object" &&
        "summary" in result &&
        "fieldErrors" in result
          ? result
          : getValidationFeedback(result, "Please fix the highlighted fields.");

      const nextError =
        feedback?.fieldErrors?.image?.[0] ??
        feedback?.fieldErrors?.image_file?.[0] ??
        feedback?.summary ??
        "Unable to update category image.";
      setImageError(nextError);
      toast.error(nextError);
    });
  };

  const renderImage = previewUrl ?? currentImageUrl;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg">Image</CardTitle>
          <span className="text-xs text-muted-foreground">
            {currentImageLabel}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-4">
            <Skeleton className="h-28 w-28 rounded-xl" />
            <div className="space-y-2 text-sm text-muted-foreground">
              <Skeleton className="h-4 w-72" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border",
                !renderImage && "bg-primary text-primary-foreground",
              )}
            >
              {renderImage && category ? (
                <Image
                  src={renderImage}
                  alt={category.name}
                  width={112}
                  loading="eager"
                  height={112}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xl font-semibold">{initials || "?"}</span>
              )}
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                Upload a square image to match the category placeholder used in
                the app.
              </p>
              <p>
                Existing image, if any, is shown above. The upload only updates
                the image asset.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-52" />
            </div>
          ) : (
            <>
              <Label htmlFor="category-image">Category Image</Label>
              <Input
                id="category-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {previewUrl ? (
                <p className="text-xs text-muted-foreground">
                  Selected image preview is ready for upload.
                </p>
              ) : null}
              {imageError ? (
                <p className="text-sm text-destructive">{imageError}</p>
              ) : null}
            </>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-20" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button onClick={handleUpload} disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Upload Image"}
            </Button>
            {selectedImage ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setSelectedImage(null);
                  replacePreviewUrl(null);
                  setImageError(null);
                }}
              >
                Clear
              </Button>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function View({ slug }: { slug: string }) {
  const [specificationPage, setSpecificationPage] = useState<number>(1);
  const [specificationPerPage, setSpecificationPerPage] =
    useState<string>("15");
  const [specificationSearchInput, setSpecificationSearchInput] =
    useState<string>("");
  const [specificationSearch, setSpecificationSearch] = useState<string>("");
  const [
    { data: categoryResponse },
    { data: specificationsResponse },
    { data: attributesResponse },
  ] = useQueries({
    queries: [
      {
        queryKey: ["category", slug],
        queryFn: () => actionViewCategory(slug),
      },
      {
        queryKey: [
          "specification",
          specificationPage,
          specificationPerPage,
          specificationSearch,
        ],
        placeholderData: keepPreviousData,
        queryFn: () =>
          actionGetSpecifications({
            page: specificationPage,
            perPage: specificationPerPage || "15",
            filter: { key: specificationSearch },
          }),
      },
      {
        queryKey: ["attribute"],
        queryFn: () => actionGetAttributes(),
      },
    ],
  });
  const response = {
    category: categoryResponse?.data.payload.category as TCategory,
    attributes: attributesResponse,
    specifications: specificationsResponse?.data.payload
      .specifications as IPaginatedData<TSpecification[]>,
  };
  const specificationsQuery = specificationsResponse;
  // states
  const [selectedAttributes, setSelectedAttributes] = useState<string[] | null>(
    null,
  );
  const [selectedSpecifications, setSelectedSpecifications] = useState<
    string[] | null
  >(null);
  const [attributeUpdateError, setAttributeUpdateError] = useState<
    string | null
  >(null);
  const [specificationUpdateError, setSpecificationUpdateError] = useState<
    string | null
  >(null);
  const effectiveSelectedAttributes =
    selectedAttributes ?? response.category?.attributes ?? [];
  const effectiveSelectedSpecifications =
    selectedSpecifications ?? response.category?.specifications ?? [];
  const [categoryState, setCategoryState] = useState<TCategory | null>(null);

  const handleAttributeChange = (uuid: string) => {
    setAttributeUpdateError(null);
    setSelectedAttributes((prevState) => {
      const current = prevState ?? response.category?.attributes ?? [];
      return current.includes(uuid)
        ? current.filter((id) => id !== uuid)
        : [...current, uuid];
    });
  };
  const handleSpecificationChange = (specId: string) => {
    setSpecificationUpdateError(null);
    setSelectedSpecifications((prevState) =>
      (prevState ?? response.category?.specifications ?? []).includes(specId)
        ? (prevState ?? response.category?.specifications ?? []).filter(
            (id) => id !== specId,
          )
        : [...(prevState ?? response.category?.specifications ?? []), specId],
    );
  };

  const handleSpecificationNextPage = () =>
    setSpecificationPage((prev) => prev + 1);
  const handleSpecificationPrevPage = () =>
    setSpecificationPage((prev) => Math.max(prev - 1, 1));
  const handleSpecificationPerPage = (value: string) => {
    setSpecificationPerPage(value);
    setSpecificationPage(1);
  };
  const handleAttributeSubmit = () => {
    setAttributeUpdateError(null);
    actionUpdateCategory(slug, {
      attributes: effectiveSelectedAttributes,
    }).then((result) => {
      if (result && "data" in result && result.data.message == "success") {
        toast.info("Category updated successfully");
        setCategoryState(result.data.payload.category as TCategory);
        return;
      }

      const feedback =
        result &&
        typeof result === "object" &&
        "summary" in result &&
        "fieldErrors" in result
          ? result
          : getValidationFeedback(result, "Please fix the highlighted fields.");
      if (feedback?.fieldErrors.attributes?.[0]) {
        setAttributeUpdateError(feedback.fieldErrors.attributes[0]);
      }
      toast.error(feedback?.summary ?? "Something went wrong");
    });
  };
  const handleSpecificationSubmit = () => {
    setSpecificationUpdateError(null);
    actionUpdateCategory(slug, {
      specifications: effectiveSelectedSpecifications,
    }).then((result) => {
      if (result && "data" in result && result.data.message === "success") {
        toast.info("Category updated successfully");
        setCategoryState(result.data.payload.category as TCategory);
        return;
      }

      const feedback =
        result &&
        typeof result === "object" &&
        "summary" in result &&
        "fieldErrors" in result
          ? result
          : getValidationFeedback(result, "Please fix the highlighted fields.");
      if (feedback?.fieldErrors.specifications?.[0]) {
        setSpecificationUpdateError(feedback.fieldErrors.specifications[0]);
      }
      toast.error(feedback?.summary ?? "Something went wrong");
    });
  };
  const currentCategory = categoryState ?? response.category;
  const isCategoryLoading = !currentCategory;
  return (
    <div className="flex-col space-y-4">
      <CategoryCard
        category={
          currentCategory
            ? {
                ...currentCategory,
                attribute_count: currentCategory?.attributes?.length ?? 0,
                specification_count:
                  currentCategory?.specifications?.length ?? 0,
              }
            : undefined
        }
        isLoading={isCategoryLoading}
      />
      <CategoryImagePanel
        category={currentCategory}
        isLoading={isCategoryLoading}
        onUploaded={(nextCategory) => setCategoryState(nextCategory)}
      />
      {response.attributes !== undefined &&
      !("error" in response.attributes) ? (
        <CategoryAttributesCard
          attributes={response.attributes?.attributes.data ?? []}
          selectedIds={effectiveSelectedAttributes}
          feedbackMessage={attributeUpdateError}
          isLoading={!response.attributes || "error" in response.attributes}
          onAttributeChange={handleAttributeChange}
          onUpdateAction={handleAttributeSubmit}
        />
      ) : null}
      <CategorySpecificationsCard
        specifications={response.specifications?.data ?? []}
        searchValue={specificationSearchInput}
        perPageValue={specificationPerPage}
        isFetching={Boolean(specificationsQuery?.isFetching)}
        onSearchChange={(value) => {
          setSpecificationSearchInput(value);
        }}
        onSpecificationChange={handleSpecificationChange}
        selectedIds={effectiveSelectedSpecifications}
        onNextPage={handleSpecificationNextPage}
        onPreviousPage={handleSpecificationPrevPage}
        onPerPageChange={handleSpecificationPerPage}
        onFilterAction={() => {
          setSpecificationSearch(specificationSearchInput.trim());
          setSpecificationPage(1);
        }}
        feedbackMessage={specificationUpdateError}
        onUpdateAction={handleSpecificationSubmit}
      />
    </div>
  );
}
