"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IMetaData } from "@/modules/core";
import ErrorComponent from "@/modules/core/components/client/ErrorComponent";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";
import {
  TCategoryIndexPayload,
  TEditProductPayload,
} from "@/modules/product.management";
import useUpdateProduct from "@/modules/product.management/hooks/useUpdateProduct";
import CategoryDropdown from "@/modules/product.management/ui/CategoryDropdown";
import ImageUploader from "@/modules/product.management/ui/ImageUploader";
import ProductCard from "@/modules/product.management/ui/ProductCard";
import ProductDetail from "@/modules/product.management/ui/ProductDetail";
import ProductVariant from "@/modules/product.management/ui/ProductVariant";
import { use, useRef } from "react";

interface EditProps {
  productPayloadPromise: Promise<TEditProductPayload | IMetaData>;
  categoryIndexPayloadPromise: Promise<TCategoryIndexPayload | IMetaData>;
}

export default function Edit({
  productPayloadPromise,
  categoryIndexPayloadPromise,
}: EditProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const basePriceRef = useRef<HTMLInputElement>(null);
  const {
    showCategoryDropdown,
    handleCategoryDropdownChange,
    filters,
    subCategories,
    subChildCategories,
    handleClickRoot,
    handleClickSub,
    handleClickSubChild,
    updateFilter,
    selectedCategories,
    product,
    categorySpecifications,
    handleSpecificationChange,
    selectedSpecifications,
    selectorState,
    variantState,
    handleProductImageUpload,
    existingProductImages,
    handleUpdate,
    productForm,
    onProductFormInputChange,
  } = useUpdateProduct(productPayloadPromise);
  const categoryIndexPayload = use(categoryIndexPayloadPromise);
  if ("error" in categoryIndexPayload) {
    return <ErrorComponent err={categoryIndexPayload.error} />;
  }
  const rootCategories = categoryIndexPayload.categories.data;
  return (
    <PageContainer pageTitle="Create Products">
      <ProductCard title="Basic Information">
        <div className="w-full max-w-6xl flex-col items-center space-y-4">
          <Label htmlFor="name">Name</Label>
          <Input
            value={productForm.name}
            onChange={onProductFormInputChange}
            name="name"
            className="focus-visible:ring-primary"
            type="text"
            id="name"
            placeholder="Ex. Nikon Coolpix A300 Digital Camera"
          />
          <Label>Base Price</Label>
          <Input
            value={productForm.base_price}
            onChange={onProductFormInputChange}
            className="focus-visible:ring-primary"
            type="number"
            id="base_price"
            placeholder="base price"
            name="base_price"
          />
          <ProductDetail
            productForm={productForm}
            onChange={onProductFormInputChange}
          />
        </div>
      </ProductCard>
      <ProductCard title="Category">
        <CategoryDropdown
          selectedCategories={selectedCategories}
          open={showCategoryDropdown}
          onOpenChangeAction={handleCategoryDropdownChange}
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
      </ProductCard>
      {selectedCategories?.length === 3 && (
        <>
          {/*** Product Image Start ***/}
          <ProductCard
            title="Product Images"
            tooltip={{
              trigger: { type: "icon" },
              texts: [
                "This is the main image of your product page. Maximum 8 images can be uploaded.",
                "Image size between 330x330 and 5000x5000 px. Max file size: 3 MB.",
                "Obscene image is strictly prohibited.",
              ],
            }}
          >
            <ImageUploader
              onImageSelect={handleProductImageUpload}
              initialImages={existingProductImages}
            />
          </ProductCard>
          {/*** Product Image ends ***/}
          {/*** Product Specifications starts ***/}
          {categorySpecifications.length > 0 && (
            <ProductCard title="Product Specifications">
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                {categorySpecifications.map((specification) => (
                  <div className="flex-col space-y-3" key={specification.uuid}>
                    <Label
                      htmlFor={`specification-value-`.concat(specification.key)}
                    >
                      {specification.key.replaceAll("-", " ")}
                    </Label>
                    {specification.type === "text" && (
                      <Input
                        name={`specifications[${specification.key}]`}
                        id={`specification-value-`.concat(specification.key)}
                        type={specification.type}
                        required={true}
                        className="focus-visible:ring-primary"
                        defaultValue={
                          selectedSpecifications[specification.key] || ""
                        }
                        onChange={(e) =>
                          handleSpecificationChange(
                            specification.key,
                            e.target.value,
                          )
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            </ProductCard>
          )}
          {/*** Product Specifications ends ***/}

          {/*** Product variants starts ***/}
          {selectorState.attributes?.length > 0 && (
            <ProductCard title="Product Variants">
              <ProductVariant
                variantState={variantState}
                selectorState={selectorState}
              />
            </ProductCard>
          )}
          {/*** Product description ends ***/}

          <div className="pb-10">
            <ThemedButton onClick={handleUpdate} className="w-full">
              Submit
            </ThemedButton>
          </div>
        </>
      )}
    </PageContainer>
  );
}
