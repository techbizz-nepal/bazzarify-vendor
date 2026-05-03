"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ProductSubmissionFeedback, TImage, TVariant } from "@/modules/product.management";
import { resolveStorageImageUrl } from "@/modules/product.management/utils/imageUrl";
import { getSubmissionFieldError } from "@/modules/product.management/utils/productSubmissionFeedback";
import Image from "next/image";
import { ChangeEvent, useMemo } from "react";

interface OptionlessSkuEditorProps {
  variant: TVariant;
  feedback?: ProductSubmissionFeedback | null;
  onChange: <K extends keyof TVariant>(field: K, value: TVariant[K]) => void;
  onUpload: (files: FileList) => void;
  onImageRemove: (image: File | string | TImage) => Promise<void>;
}

function PreviewImage({ file }: { file: File }) {
  const src = useMemo(() => URL.createObjectURL(file), [file]);

  return (
    <Image
      src={src}
      alt="Internal SKU"
      width={96}
      height={96}
      className="h-20 w-20 rounded border object-cover"
    />
  );
}

export default function OptionlessSkuEditor({
  variant,
  feedback,
  onChange,
  onUpload,
  onImageRemove,
}: OptionlessSkuEditorProps) {
  const skuError = getSubmissionFieldError(feedback, "variants.0.sku");
  const stockError = getSubmissionFieldError(feedback, "variants.0.stock");
  const priceError = getSubmissionFieldError(feedback, "variants.0.price");
  const imagesError = getSubmissionFieldError(feedback, "variants.0.images");

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    onUpload(event.target.files);
    event.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
        This product will still save one internal SKU for price, stock,
        availability, cart identity, and reservations. Customers will not see a
        fake default option.
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="optionless-sku">Internal SKU</Label>
          <Input
            id="optionless-sku"
            value={variant.sku || ""}
            onChange={(event) => onChange("sku", event.target.value)}
            placeholder="FACE-WASH-01"
          />
          {skuError ? <p className="text-sm text-destructive">{skuError}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="optionless-stock">Stock</Label>
          <Input
            id="optionless-stock"
            type="number"
            min="0"
            value={variant.stock || ""}
            onChange={(event) => onChange("stock", event.target.value)}
            placeholder="0"
          />
          {stockError ? (
            <p className="text-sm text-destructive">{stockError}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="optionless-price">Price</Label>
          <Input
            id="optionless-price"
            type="number"
            min="0"
            value={variant.price || ""}
            onChange={(event) => onChange("price", event.target.value)}
            placeholder="0.00"
          />
          {priceError ? (
            <p className="text-sm text-destructive">{priceError}</p>
          ) : null}
        </div>

        <div className="flex items-center justify-between rounded-md border px-4 py-3">
          <div>
            <p className="font-medium">Available for sale</p>
            <p className="text-sm text-muted-foreground">
              Turn this off to keep the internal SKU unavailable.
            </p>
          </div>
          <Switch
            checked={variant.available ?? true}
            onCheckedChange={(checked) => onChange("available", checked)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="optionless-images">Internal SKU Images</Label>
        <Input
          id="optionless-images"
          type="file"
          multiple
          accept="image/*"
          onChange={handleUpload}
        />
        <p className="text-sm text-muted-foreground">
          Optional. If you leave this empty, product images are still used.
        </p>
        {imagesError ? (
          <p className="text-sm text-destructive">{imagesError}</p>
        ) : null}

        {variant.images?.length ? (
          <div className="flex flex-wrap gap-3">
            {variant.images.map((image, index) => (
              <div key={`${index}-${typeof image}`} className="space-y-2">
                {image instanceof File ? (
                  <PreviewImage file={image} />
                ) : (
                  <Image
                    src={resolveStorageImageUrl(image, variant.image_base_url)}
                    alt="Internal SKU"
                    width={96}
                    height={96}
                    className="h-20 w-20 rounded border object-cover"
                  />
                )}
                <button
                  type="button"
                  className="text-xs text-destructive"
                  onClick={() => void onImageRemove(image)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
