"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IMetaData } from "@/modules/core";
import { cn } from "@/lib/utils";
import ErrorComponent from "@/modules/core/components/client/ErrorComponent";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";
import { TCategoryIndexPayload } from "@/modules/product.management";
import useCreateProduct from "@/modules/product.management/hooks/useCreateProduct";
import CategoryDropdown from "@/modules/product.management/ui/CategoryDropdown";
import ImageUploader from "@/modules/product.management/ui/ImageUploader";
import ProductCard from "@/modules/product.management/ui/ProductCard";
import ProductDetail from "@/modules/product.management/ui/ProductDetail";
import ProductVariant from "@/modules/product.management/ui/ProductVariant";
import {
  getSubmissionFieldError,
  hasSubmissionFieldPrefix,
} from "@/modules/product.management/utils/productSubmissionFeedback";
interface CreateProps {
  categoryIndexPayload: TCategoryIndexPayload | IMetaData;
}
export default function Create({ categoryIndexPayload }: CreateProps) {
  if ("error" in categoryIndexPayload) {
    return <ErrorComponent err={categoryIndexPayload.error} />;
  }

  return <CreateContent categoryIndexPayload={categoryIndexPayload} />;
}

function CreateContent({
  categoryIndexPayload,
}: {
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
  } = useCreateProduct();
  const feedback = submissionState.feedback;
  const rootCategories = categoryIndexPayload.categories.data;
  const nameError = getSubmissionFieldError(feedback, "name");
  const basePriceError = getSubmissionFieldError(feedback, "base_price");
  const skuError = getSubmissionFieldError(feedback, "sku");
  const categoryError = getSubmissionFieldError(feedback, "category");
  const variantsError = hasSubmissionFieldPrefix(feedback, "variants");
  const imagesError =
    getSubmissionFieldError(feedback, "images") ||
    (hasSubmissionFieldPrefix(feedback, "images")
      ? feedback?.fieldErrors.images?.[0]
      : undefined);
  const specificationErrors = specificationState.categorySpecifications.some(
    (specification) =>
      Boolean(
        getSubmissionFieldError(feedback, `specifications.${specification.key}`),
      ),
  );
  const basicInfoError = Boolean(
    nameError ||
      basePriceError ||
      skuError ||
      getSubmissionFieldError(feedback, "description") ||
      getSubmissionFieldError(feedback, "highlights") ||
      getSubmissionFieldError(feedback, "box_items"),
  );
  return (
    <PageContainer pageTitle="Create Products">
      {/*** Product Basic information start ***/}
      <ProductCard
        title="Basic Information"
        className={basicInfoError ? "border-destructive" : undefined}
      >
        <div className="w-full max-w-6xl flex-col items-center space-y-4">
          <Label htmlFor="name">Name</Label>
          <Input
            value={basicState.productForm.name}
            onChange={basicState.onProductFormInputChange}
            name="name"
            className={cn("focus-visible:ring-primary", nameError && "border-destructive")}
            type="text"
            id="name"
            placeholder="Ex. Nikon Coolpix A300 Digital Camera"
          />
          {nameError && <p className="text-sm text-destructive">{nameError}</p>}
          <Label>Base Price</Label>
          <Input
            value={basicState.productForm.base_price}
            onChange={basicState.onProductFormInputChange}
            className={cn(
              "focus-visible:ring-primary",
              basePriceError && "border-destructive",
            )}
            type="number"
            id="base_price"
            placeholder="base price"
            name="base_price"
          />
          {basePriceError && (
            <p className="text-sm text-destructive">{basePriceError}</p>
          )}
          <Label htmlFor="name">SKU</Label>
          <Input
            value={basicState.productForm.sku}
            onChange={basicState.onProductFormInputChange}
            name="sku"
            className={cn("focus-visible:ring-primary", skuError && "border-destructive")}
            type="text"
            id="sku"
            placeholder="min 8 character alphabets or number"
          />
          {skuError && <p className="text-sm text-destructive">{skuError}</p>}
          <ProductDetail
            productForm={basicState.productForm}
            onChange={basicState.onProductFormInputChange}
            feedback={feedback}
          />
        </div>
      </ProductCard>
      {/*** Product Basic information ends ***/}
      <ProductCard title="Category" className={categoryError ? "border-destructive" : undefined}>
        <CategoryDropdown
          selectedCategories={categoryState.selectedCategories}
          committedCategories={categoryState.committedCategories}
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
          onCommitSelectedCategory={categoryState.handleCommitSelectedCategory}
          onFilterChange={categoryState.updateFilter}
          invalid={Boolean(categoryError)}
          errorMessage={categoryError}
        />
      </ProductCard>
      {categoryState.committedCategory && (
        <>
          {/*** Product Image Start ***/}
          <ProductCard
            title="Product Images"
            className={imagesError ? "border-destructive" : undefined}
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
              invalid={Boolean(imagesError)}
              errorMessage={imagesError}
            />
          </ProductCard>
          {/*** Product Image ends ***/}
          {/*** Product Specifications starts ***/}
          {specificationState.categorySpecifications.length > 0 && (
            <ProductCard
              title="Specifications"
              className={specificationErrors ? "border-destructive" : undefined}
            >
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                {specificationState.categorySpecifications.map((specification) => (
                  <div className="flex-col space-y-3" key={specification.uuid}>
                    <Label
                      htmlFor={`specification-value-`.concat(specification.key)}
                    >
                      {specification.key.replaceAll("-", " ")}
                    </Label>
                    {specification.type === "text" && (
                      <>
                        <Input
                          name={`specifications[${specification.key}]`}
                          id={`specification-value-`.concat(specification.key)}
                          type={specification.type}
                          required={true}
                          className={cn(
                            "focus-visible:ring-primary",
                            getSubmissionFieldError(
                              feedback,
                              `specifications.${specification.key}`,
                            ) && "border-destructive",
                          )}
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
                        {getSubmissionFieldError(
                          feedback,
                          `specifications.${specification.key}`,
                        ) && (
                          <p className="text-sm text-destructive">
                            {
                              getSubmissionFieldError(
                                feedback,
                                `specifications.${specification.key}`,
                              )
                            }
                          </p>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </ProductCard>
          )}
          {/*** Product Specifications ends ***/}

          {/*** Product variants starts ***/}
          {selectorState.attributes?.length > 0 && (
            <ProductCard title="Variants" className={variantsError ? "border-destructive" : undefined}>
              <ProductVariant
                feedback={feedback}
                selectorState={selectorState}
                variantState={{
                  setVariantSelections: variantState.setVariantSelections,
                  combinations: variantState.combinations,
                  variantData: variantState.variantData,
                  handleVariantChange: variantState.handleVariantChange,
                  handleImageUpload: variantState.handleImageUpload,
                  handleImageRemove: variantState.handleImageRemove,
                  columns: variantState.columns,
                }}
              />
            </ProductCard>
          )}
          {/*** Product variants ends ***/}
          <div className="pb-10">
            {feedback && (
              <div className="mb-3 rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {feedback.summary}
              </div>
            )}
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
