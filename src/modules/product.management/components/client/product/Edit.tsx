"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { IMetaData } from "@/modules/core";
import ErrorComponent from "@/modules/core/components/client/ErrorComponent";
import BackLinkButton from "@/modules/core/components/server/BackLinkButton";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";
import {
  TCategoryIndexPayload,
  TEditProductPayload,
} from "@/modules/product.management";
import useUpdateProduct from "@/modules/product.management/hooks/useUpdateProduct";
import CategoryDropdown from "@/modules/product.management/ui/CategoryDropdown";
import ImageUploader from "@/modules/product.management/ui/ImageUploader";
import OptionlessSkuEditor from "@/modules/product.management/ui/OptionlessSkuEditor";
import ProductCard from "@/modules/product.management/ui/ProductCard";
import ProductDetail from "@/modules/product.management/ui/ProductDetail";
import ProductVariant from "@/modules/product.management/ui/ProductVariant";
import {
  getSubmissionFieldError,
  hasSubmissionFieldPrefix,
} from "@/modules/product.management/utils/productSubmissionFeedback";
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
    authoringProfile,
    basicState,
    categoryState,
    mediaState,
    specificationState,
    selectorState,
    variantState,
    optionModeState,
    submissionState,
  } = useUpdateProduct(productPayload);
  const supportsImages = authoringProfile?.capabilities.images ?? true;
  const supportsSpecifications =
    authoringProfile?.capabilities.specifications ?? true;
  const supportsVariants = authoringProfile?.capabilities.variants ?? true;
  const supportsCustomerOptions =
    authoringProfile?.capabilities.customer_options ?? true;
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
        getSubmissionFieldError(
          feedback,
          `specifications.${specification.key}`,
        ),
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
    <PageContainer
      pageTitle="Edit Product"
      actionSlot={<BackLinkButton href="/products" label="Back to Products" />}
    >
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
            className={cn(
              "focus-visible:ring-primary",
              nameError && "border-destructive",
            )}
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
            disabled={true}
            value={basicState.productForm.sku}
            onChange={basicState.onProductFormInputChange}
            name="sku"
            className={cn(
              "focus-visible:ring-primary",
              skuError && "border-destructive",
            )}
            type="text"
            id="sku"
            placeholder="NCADC"
          />
          {skuError && <p className="text-sm text-destructive">{skuError}</p>}
          <ProductDetail
            productForm={basicState.productForm}
            onChange={basicState.onProductFormInputChange}
            feedback={feedback}
          />
        </div>
      </ProductCard>
      <ProductCard
        title="Category"
        className={categoryError ? "border-destructive" : undefined}
      >
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
          categoryChangeLocked={categoryState.categoryChangeLocked}
          lockedSelectionMessage="Category changes are unavailable in edit. Create a new product if you need a different category."
        />
        <p className="pt-2 text-sm text-muted-foreground">
          Category reassignment is currently unavailable while editing an
          existing product.
        </p>
      </ProductCard>
      {categoryState.committedCategory && (
        <>
          {/*** Product Image Start ***/}
          {supportsImages && (
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
              <p className="mb-3 text-sm text-muted-foreground">
                Existing product image removals are staged locally and only
                apply after you save this product.
              </p>
              <ImageUploader
                onImageSelect={mediaState.handleProductImageUpload}
                initialImages={mediaState.existingProductImages}
                onRemoveExisting={async (url) => {
                  return await mediaState.handleRemoveExistingProductImage!(
                    url,
                  );
                }}
                onExistingListChange={(urls) =>
                  mediaState.handleExistingProductImagesChange(urls)
                }
                invalid={Boolean(imagesError)}
                errorMessage={imagesError}
              />
              {mediaState.hasPendingExistingImageRemovals && (
                <p className="mt-3 text-sm text-amber-700">
                  Pending product image removals will apply when you save.
                </p>
              )}
            </ProductCard>
          )}
          {/*** Product Image ends ***/}
          {/*** Product Specifications starts ***/}
          {supportsSpecifications &&
            specificationState.categorySpecifications.length > 0 && (
              <ProductCard
                title="Product Specifications"
                className={
                  specificationErrors ? "border-destructive" : undefined
                }
              >
                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                  {specificationState.categorySpecifications.map(
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
                          <>
                            <Input
                              name={`specifications[${specification.key}]`}
                              id={`specification-value-`.concat(
                                specification.key,
                              )}
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
                                {getSubmissionFieldError(
                                  feedback,
                                  `specifications.${specification.key}`,
                                )}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </ProductCard>
            )}
          {/*** Product Specifications ends ***/}

          {/*** Product variants starts ***/}
          {supportsVariants && (
            <ProductCard
              title="Customer Options"
              className={variantsError ? "border-destructive" : undefined}
            >
              <div className="space-y-4">
                {supportsCustomerOptions && (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Does this product have customer-selectable options?
                    </p>
                    <div className="flex gap-3">
                      <ThemedButton
                        type="button"
                        variant={
                          optionModeState.hasCustomerSelectableOptions
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          optionModeState.setHasCustomerSelectableOptions(true)
                        }
                      >
                        Yes
                      </ThemedButton>
                      <ThemedButton
                        type="button"
                        variant={
                          optionModeState.hasCustomerSelectableOptions
                            ? "outline"
                            : "default"
                        }
                        onClick={() =>
                          optionModeState.setHasCustomerSelectableOptions(false)
                        }
                      >
                        No
                      </ThemedButton>
                    </div>
                  </>
                )}
                {optionModeState.modeLockedMessage ? (
                  <p className="text-sm text-muted-foreground">
                    {optionModeState.modeLockedMessage}
                  </p>
                ) : null}
                {supportsCustomerOptions &&
                optionModeState.hasCustomerSelectableOptions ? (
                  selectorState.attributes?.length > 0 ? (
                    <>
                      <p className="mb-3 text-sm text-muted-foreground">
                        Existing variant image removals are staged locally and
                        only apply after you save this product.
                      </p>
                      <ProductVariant
                        feedback={feedback}
                        variantState={variantState}
                        selectorState={selectorState}
                      />
                      {variantState.hasPendingExistingImageRemovals && (
                        <p className="mt-4 text-sm text-amber-700">
                          Pending variant image removals will apply when you
                          save.
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      This category has no customer-selectable attributes, so
                      use the internal SKU mode instead.
                    </p>
                  )
                ) : (
                  <OptionlessSkuEditor
                    variant={optionModeState.optionlessVariant}
                    feedback={feedback}
                    onChange={optionModeState.handleOptionlessVariantChange}
                    onUpload={
                      optionModeState.handleOptionlessVariantImageUpload
                    }
                    onImageRemove={
                      optionModeState.handleOptionlessVariantImageRemove
                    }
                  />
                )}
              </div>
            </ProductCard>
          )}
          {/*** Product description ends ***/}

          <div className="pb-10">
            {feedback && (
              <div className="mb-3 rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {feedback.summary}
              </div>
            )}
            <ThemedButton
              onClick={submissionState.handleSubmit}
              disabled={submissionState.isSubmitting}
              className="w-full"
            >
              {submissionState.isSubmitting ? "Submitting..." : "Submit"}
            </ThemedButton>
          </div>
        </>
      )}
    </PageContainer>
  );
}
