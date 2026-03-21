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
interface EditProps {
  productPayload: TEditProductPayload | IMetaData;
  categoryIndexPayload: TCategoryIndexPayload | IMetaData;
}

export default function Edit({
  productPayload,
  categoryIndexPayload,
}: EditProps) {
  if ("error" in productPayload) {
    return <ErrorComponent err={productPayload.error} />;
  }
  if ("error" in categoryIndexPayload) {
    return <ErrorComponent err={categoryIndexPayload.error} />;
  }

  return (
    <EditContent
      productPayload={productPayload}
      categoryIndexPayload={categoryIndexPayload}
    />
  );
}

function EditContent({
  productPayload,
  categoryIndexPayload,
}: {
  productPayload: TEditProductPayload;
  categoryIndexPayload: TCategoryIndexPayload;
}) {
  const {
    basicState,
    categoryState,
    mediaState,
    specificationState,
    selectorState,
    variantState,
    submissionState,
  } = useUpdateProduct(productPayload);
  const rootCategories = categoryIndexPayload.categories.data;
  return (
    <PageContainer pageTitle="Edit Product">
      <ProductCard title="Basic Information">
        <div className="w-full max-w-6xl flex-col items-center space-y-4">
          <Label htmlFor="name">Name</Label>
          <Input
            value={basicState.productForm.name}
            onChange={basicState.onProductFormInputChange}
            name="name"
            className="focus-visible:ring-primary"
            type="text"
            id="name"
            placeholder="Ex. Nikon Coolpix A300 Digital Camera"
          />
          <Label>Base Price</Label>
          <Input
            value={basicState.productForm.base_price}
            onChange={basicState.onProductFormInputChange}
            className="focus-visible:ring-primary"
            type="number"
            id="base_price"
            placeholder="base price"
            name="base_price"
          />
          <Label htmlFor="name">SKU</Label>
          <Input
            disabled={true}
            value={basicState.productForm.sku}
            onChange={basicState.onProductFormInputChange}
            name="sku"
            className="focus-visible:ring-primary"
            type="text"
            id="sku"
            placeholder="NCADC"
          />
          <ProductDetail
            productForm={basicState.productForm}
            onChange={basicState.onProductFormInputChange}
          />
        </div>
      </ProductCard>
      <ProductCard title="Category">
        <CategoryDropdown
          selectedCategories={categoryState.selectedCategories}
          open={categoryState.showDropdown}
          onOpenChangeAction={categoryState.handleShowDropdownChange}
          rootCategories={rootCategories.filter((cat) =>
            cat.name
              .toLowerCase()
              .includes(categoryState.filters.root.toLowerCase()),
          )}
          subCategories={categoryState.subCategories.filter((cat) =>
            cat.name
              .toLowerCase()
              .includes(categoryState.filters.sub.toLowerCase()),
          )}
          subChildCategories={categoryState.subChildCategories.filter((cat) =>
            cat.name
              .toLowerCase()
              .includes(categoryState.filters.subchild.toLowerCase()),
          )}
          onClickRoot={categoryState.handleClickRoot}
          onClickSub={categoryState.handleClickSub}
          onClickSubChild={categoryState.handleClickSubChild}
          onFilterChange={categoryState.updateFilter}
        />
      </ProductCard>
      {categoryState.selectedCategories.length === 3 && (
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
              onImageSelect={mediaState.handleProductImageUpload}
              initialImages={mediaState.existingProductImages}
              onRemoveExisting={async (url) => {
                return await mediaState.handleRemoveExistingProductImage!(url);
              }}
              onExistingListChange={(urls) =>
                mediaState.handleExistingProductImagesChange(urls)
              }
            />
          </ProductCard>
          {/*** Product Image ends ***/}
          {/*** Product Specifications starts ***/}
          {specificationState.categorySpecifications.length > 0 && (
            <ProductCard title="Product Specifications">
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                {specificationState.categorySpecifications.map((specification) => (
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
                        value={
                          specificationState.specificationValues[
                            specification.key
                          ] || ""
                        }
                        onChange={(e) =>
                          specificationState.handleSpecificationChange(
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
            <ThemedButton
              onClick={submissionState.handleSubmit}
              className="w-full"
            >
              Submit
            </ThemedButton>
          </div>
        </>
      )}
    </PageContainer>
  );
}
