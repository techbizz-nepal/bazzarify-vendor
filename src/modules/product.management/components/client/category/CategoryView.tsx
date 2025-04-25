"use client";

import { useQueries } from "@tanstack/react-query";
import {
  actionUpdateCategory,
  actionViewCategory,
} from "@/modules/product.management/actions/category";
import { actionGetSpecifications } from "@/modules/product.management/actions/specification";
import { useEffect, useState } from "react";
import {
  IPaginatedData,
  TAttribute,
  TCategory,
  TSpecification,
} from "@/modules/product.management";
import { actionGetAttributes } from "@/modules/product.management/actions/attribute";
import CategoryCard from "@/modules/product.management/components/client/category/ui/CategoryCard";
import CategoryAttributesCard from "@/modules/product.management/components/client/category/ui/CategoryAttributesCard";
import CategorySpecificationsCard from "@/modules/product.management/components/client/category/ui/CategorySpecificationsCard";
import { toast } from "sonner";
import ContentSkeleton from "@/modules/core/components/server/ContentSkeleton";

export default function CategoryView({ slug }: { slug: string }) {
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
      { queryKey: ["attribute"], queryFn: actionGetAttributes },
    ],
  });
  // declarations;
  const response = {
    category: categoryResponse?.data.payload.category as TCategory,
    attributes: attributesResponse?.data.payload.attributes as TAttribute[],
    specifications: specificationsResponse?.data.payload
      .specifications as IPaginatedData<TSpecification[]>,
  };
  // states
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [selectedSpecifications, setSelectedSpecifications] = useState<
    string[]
  >([]);

  useEffect(() => {
    if (response.category) {
      setSelectedAttributes(response.category.attributes);
      setSelectedSpecifications(response.category.specifications);
    }
  }, [response.category]);

  const handleAttributeChange = (uuid: string) => {
    setSelectedAttributes((prevState) =>
      prevState.includes(uuid)
        ? prevState.filter((id) => id !== uuid)
        : [...prevState, uuid],
    );
  };
  const handleSpecificationChange = (specId: string) => {
    setSelectedSpecifications((prevState) =>
      prevState.includes(specId)
        ? prevState.filter((id) => id !== specId)
        : [...prevState, specId],
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
      body = { attributes: selectedAttributes };
    }
    if (entity === "specifications") {
      body = { specifications: selectedSpecifications };
    }
    if (!body) {
      return;
    }
    actionUpdateCategory(slug, body).then((result) => {
      if (result.data.message == "success") {
        toast.info("Category updated successfully");
      } else {
        toast.error("Something went wrong");
      }
    });
  };
  return (
    <div className="flex-col space-y-4">
      {response.category ? (
        <CategoryCard category={response.category} />
      ) : (
        <ContentSkeleton />
      )}
      {!response.category?.children?.length && (
        <>
          {response.attributes ? (
            <CategoryAttributesCard
              attributes={response.attributes}
              selectedIds={selectedAttributes}
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
              selectedIds={selectedSpecifications}
              onNextPage={handleSpecificationNextPage}
              onPreviousPage={handleSpecificationPrevPage}
              onPerPageChange={handleSpecificationPerPage}
              onUpdateAction={handleUpdateCategory}
            />
          ) : (
            <ContentSkeleton />
          )}
        </>
      )}
    </div>
  );
}
