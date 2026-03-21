"use client";

import ContentSkeleton from "@/modules/core/components/server/ContentSkeleton";
import {
  IPaginatedData,
  TCategory,
  TSpecification,
} from "@/modules/product.management";
import { actionGetAttributes } from "@/modules/product.management/actions/attribute";
import {
  actionUpdateCategory,
  actionViewCategory,
} from "@/modules/product.management/actions/category";
import { actionGetSpecifications } from "@/modules/product.management/actions/specification";
import CategoryAttributesCard from "@/modules/product.management/ui/CategoryAttributesCard";
import CategoryCard from "@/modules/product.management/ui/CategoryCard";
import CategorySpecificationsCard from "@/modules/product.management/ui/CategorySpecificationsCard";
import { getValidationFeedback } from "@/modules/core/lib/utils.validationFeedback";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function View({ slug }: { slug: string }) {
  const [specificationPage, setSpecificationPage] = useState<number>(1);
  const [specificationPerPage, setSpecificationPerPage] = useState<string>("");
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
        queryKey: ["specification", specificationPage, specificationPerPage],
        queryFn: () =>
          actionGetSpecifications({
            page: specificationPage,
            perPage: specificationPerPage,
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
  const effectiveSelectedAttributes =
    selectedAttributes ?? response.category?.attributes ?? [];
  const effectiveSelectedSpecifications =
    selectedSpecifications ?? response.category?.specifications ?? [];
  const categorySummary = useMemo(
    () => ({
      ...response.category,
      attribute_count: response.category?.attributes?.length ?? 0,
      specification_count: response.category?.specifications?.length ?? 0,
    }),
    [response.category],
  );

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
    setAttributeUpdateError(null);
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
  };
  const handleUpdateCategory = (entity: string) => {
    let body = null;
    if (entity === "attributes") {
      setAttributeUpdateError(null);
      body = { attributes: effectiveSelectedAttributes };
    }
    if (entity === "specifications") {
      body = { specifications: effectiveSelectedSpecifications };
    }
    if (!body) {
      return;
    }
    actionUpdateCategory(slug, body).then((result) => {
      if (result && "data" in result && result.data.message == "success") {
        toast.info("Category updated successfully");
        return;
      }

      const feedback =
        result &&
        typeof result === "object" &&
        "summary" in result &&
        "fieldErrors" in result
          ? result
          : getValidationFeedback(result, "Please fix the highlighted fields.");
      if (entity === "attributes" && feedback?.fieldErrors.attributes?.[0]) {
        setAttributeUpdateError(feedback.fieldErrors.attributes[0]);
      }
      toast.error(feedback?.summary ?? "Something went wrong");
    });
  };
  return (
    <div className="flex-col space-y-4">
      {response.category ? (
        <CategoryCard category={categorySummary} />
      ) : (
        <ContentSkeleton />
      )}
      {response.attributes !== undefined && !("error" in response.attributes) ? (
        <CategoryAttributesCard
          attributes={response.attributes.attributes.data}
          selectedIds={effectiveSelectedAttributes}
          feedbackMessage={attributeUpdateError}
          onAttributeChange={handleAttributeChange}
          onUpdateAction={handleUpdateCategory}
        />
      ) : (
        <ContentSkeleton />
      )}
      {response.specifications ? (
        <CategorySpecificationsCard
          specifications={response.specifications?.data}
          onSpecificationChange={handleSpecificationChange}
          selectedIds={effectiveSelectedSpecifications}
          onNextPage={handleSpecificationNextPage}
          onPreviousPage={handleSpecificationPrevPage}
          onPerPageChange={handleSpecificationPerPage}
          onUpdateAction={handleUpdateCategory}
        />
      ) : (
        <ContentSkeleton />
      )}
    </div>
  );
}
