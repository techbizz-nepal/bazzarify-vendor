"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ContentSkeleton from "@/modules/core/components/server/ContentSkeleton";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";
import { TCategory } from "@/modules/product.management";
import useCreateProduct from "@/modules/product.management/hooks/useCreateProduct";
import CategoryDropdown from "@/modules/product.management/ui/CategoryDropdown";
import ImageUploader from "@/modules/product.management/ui/ImageUploader";
import ProductCard from "@/modules/product.management/ui/ProductCard";
import ProductVariant from "@/modules/product.management/ui/ProductVariant";

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
    categorySpecifications,
    categoryAttributes,
    handleSpecificationChange,
    responseData,
    variantState,
    handleClickRoot,
    handleShowDropdownChange,
    handleClickSubChild,
    handleClickSub,
    updateFilter,
    handleSubmit,
    handleProductImageUpload,
  } = useCreateProduct();
  if (!responseData) return <ContentSkeleton />;
  const { data, metaData } = responseData;
  const rootCategories = (data.payload.categories?.data as TCategory[]) || [];
  if (metaData.error) {
    return <h1>Error: {metaData?.error}</h1>;
  }

  return (
    <PageContainer pageTitle="Create Products">
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
          initialImages={[
            "https://gw.alicdn.com/imgextra/i3/O1CN01x7m2GQ1LsdRDBgVMZ_!!6000000001355-2-tps-104-108.png",
          ]}
        />
      </ProductCard>
      <ProductCard title="Basic Information">
        <div className="w-full max-w-6xl flex-col items-center space-y-3">
          <Label htmlFor="product-name">Product Name</Label>
          <Input
            ref={nameRef}
            className="focus-visible:ring-primary"
            type="text"
            id="product-name"
            placeholder="Ex. Nikon Coolpix A300 Digital Camera"
          />
        </div>
        <div
          id="categories"
          className="w-full max-w-6xl flex-col items-center space-y-3"
        >
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
      </ProductCard>
      {selectedCategories?.length === 3 && (
        <>
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
                        defaultValue={specifications[specification.key] || ""}
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

          {categoryAttributes?.length > 0 && (
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
                attributes={categoryAttributes}
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
              className="w-full rounded-md border px-3 py-2"
            />
          </ProductCard>
          <div className="pb-10">
            <ThemedButton onClick={handleSubmit} className="w-full">
              Submit
            </ThemedButton>
          </div>
        </>
      )}
    </PageContainer>
  );
}
