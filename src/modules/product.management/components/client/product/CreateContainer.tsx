"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PageContainer from "@/modules/core/components/server/PageContainer";
import React, { Suspense } from "react";
import { Loader } from "lucide-react";
import CategoryDropdown from "@/modules/product.management/ui/CategoryDropdown";
import useCreateProduct from "@/modules/product.management/hooks/useCreateProduct";
import { TCategory } from "@/modules/product.management";
import ProductVariant from "@/modules/product.management/ui/ProductVariant";
import ProductCard from "@/modules/product.management/ui/ProductCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CreateContainer() {
  const {
    nameRef,
    descriptionRef,
    showDropdown,
    selectedCategories,
    subChildCategories,
    subCategories,
    filters,
    specifications,
    handleSpecificationChange,
    data,
    metaData,
    variantState,
    handleClickRoot,
    handleShowDropdownChange,
    handleClickSubChild,
    handleClickSub,
    updateFilter,
    handleSubmit,
  } = useCreateProduct();

  const rootCategories = (data.payload.categories?.data as TCategory[]) || [];
  if (metaData.error) {
    return <h1>Error: {data.metaData.error}</h1>;
  }

  const selectedCategory = selectedCategories[2];

  return (
    <PageContainer pageTitle="Create Products">
      <ProductCard title="Basic Information">
        <div className="flex-col w-full max-w-6xl items-center space-y-3">
          <Label htmlFor="product-name">Product Name</Label>
          <Input
            ref={nameRef}
            className="focus-visible:ring-primary"
            type="text"
            id="product-name"
            placeholder="Ex. Nikon Coolpix A300 Digital Camera"
          />
        </div>
        <Suspense fallback={<Loader />}>
          <div className="flex-col w-full max-w-6xl items-center space-y-3">
            <Label>Category</Label>
            <CategoryDropdown
              selectedCategories={selectedCategories}
              open={showDropdown}
              onOpenChangeAction={handleShowDropdownChange}
              rootCategories={rootCategories.filter((cat) =>
                cat.name.toLowerCase().includes(filters.root.toLowerCase()),
              )}
              subCategories={subCategories.filter((cat) =>
                cat.name.toLowerCase().includes(filters.sub.toLowerCase()),
              )}
              subChildCategories={subChildCategories.filter((cat) =>
                cat.name.toLowerCase().includes(filters.subchild.toLowerCase()),
              )}
              onClickRoot={handleClickRoot}
              onClickSub={handleClickSub}
              onClickSubChild={handleClickSubChild}
              onFilterChange={updateFilter}
            />
          </div>
        </Suspense>
      </ProductCard>
      {selectedCategories?.length === 3 && (
        <>
          <ProductCard title="Media" />
          {selectedCategories[2].specifications?.length > 0 && (
            <ProductCard title="Product Specifications">
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                {selectedCategories[2].specifications_with_model.map(
                  (specification) => (
                    <div
                      className="flex-col space-y-3"
                      key={specification.uuid}
                    >
                      <Label
                        htmlFor={`specification-value-`.concat(
                          specification.key,
                        )}
                      >
                        {specification.key.replaceAll("-", " ")}
                      </Label>
                      {specification.type === "text" && (
                        <Input
                          name={`specifications[${specification.key}]`}
                          id={`specification-value-`.concat(specification.key)}
                          type={specification.type}
                          className="focus-visible:ring-primary"
                          value={specifications[specification.key] || ""}
                          onChange={(e) =>
                            handleSpecificationChange(
                              specification.key,
                              e.target.value,
                            )
                          }
                        />
                      )}
                    </div>
                  ),
                )}
              </div>
            </ProductCard>
          )}

          {selectedCategory.attributes?.length > 0 && (
            <ProductCard title="Product Variants">
              <ProductVariant
                variantState={{
                  selections: variantState.selections,
                  setSelections: variantState.setSelections,
                  toggleValue: variantState.toggleValue,
                  removeValue: variantState.removeValue,
                  combinations: variantState.combinations,
                  variantData: variantState.variantData,
                  handleVariantChange: variantState.handleVariantChange,
                  handleImageUpload: variantState.handleImageUpload,
                  handleImageRemove: variantState.handleImageRemove,
                  columns: variantState.columns,
                  handleReorderColumns: variantState.handleReorderColumns,
                }}
                category={selectedCategory}
              />
            </ProductCard>
          )}
          <ProductCard title="Product Description">
            <Textarea
              ref={descriptionRef}
              id="product-description"
              name="description"
              rows={4}
              placeholder="Write a short product description here..."
              className="w-full border rounded-md px-3 py-2"
            />
          </ProductCard>
          <Card>
            <Button onClick={handleSubmit}>Submit</Button>
          </Card>
        </>
      )}
    </PageContainer>
  );
}
