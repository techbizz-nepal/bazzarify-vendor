"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { actionViewCategory } from "@/modules/product.management/actions/category";
import { actionGetSpecifications } from "@/modules/product.management/actions/specification";
import { Loader } from "lucide-react";
import { Suspense, useState } from "react";
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

export default function CategoryViewTanstack({ slug }: { slug: string }) {
  const [specificationPage, setSpecificationPage] = useState<number>(1);
  const [specificationPerPage, setSpecificationPerPage] = useState<string>("");
  const [
    { data: categoryResponse },
    { data: specificationsResponse },
    { data: attributesResponse },
  ] = useSuspenseQueries({
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
    category: categoryResponse.data.payload.category as TCategory,
    attributes: attributesResponse.data.payload.attributes as TAttribute[],
    specifications: specificationsResponse.data.payload
      .specifications as IPaginatedData<TSpecification[]>,
  };
  // states
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>(
    response.category.attributes,
  );
  const [selectedSpecifications, setSelectedSpecifications] = useState<
    string[]
  >(response.category.specifications);

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
  const handleSpecificationPerPage = (value: string) =>
    setSpecificationPerPage(value);
  console.log(specificationPerPage);
  return (
    <div className="flex-col space-y-4">
      <Suspense fallback={<Loader />}>
        <CategoryCard category={response.category} />
        {!response.category.children?.length && (
          <>
            <CategoryAttributesCard
              attributes={response.attributes}
              selectedIds={selectedAttributes}
              onAttributeChange={handleAttributeChange}
            />
            <CategorySpecificationsCard
              specifications={response.specifications.data}
              onSpecificationChange={handleSpecificationChange}
              selectedIds={selectedSpecifications}
              onNextPage={handleSpecificationNextPage}
              onPreviousPage={handleSpecificationPrevPage}
              onPerPageChange={handleSpecificationPerPage}
            />
          </>
        )}
      </Suspense>
    </div>
  );
}
