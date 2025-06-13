import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProductRichTextEditor from "@/modules/core/components/client/ProductRichTextEditor";
import { TProductForm } from "@/modules/product.management";
import { ChangeEvent } from "react";

interface Props {
  productForm: TProductForm;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
export default function ProductDetail({ productForm, onChange }: Props) {
  const handleRteChange = (name: string, json: string) => {
    const synthetic = {
      target: { name, value: json },
    } as unknown as ChangeEvent<HTMLInputElement>;
    onChange(synthetic);
  };
  return (
    <>
      <Label>Description</Label>
      <ProductRichTextEditor
        name="description"
        toolbar="full"
        enableImages={true}
        value={productForm.description}
        handleOnChange={handleRteChange}
        className="rounded-lg border"
        placeholder="Describe your product…"
      />
      <Label>Highlights</Label>
      <ProductRichTextEditor
        name="highlights"
        toolbar="minimal"
        enableImages={true}
        value={productForm.highlights}
        handleOnChange={handleRteChange}
        className="rounded-lg border"
        placeholder="Enter a minimum of three short highlights of the product"
      />
      <Label>What&apos;s in the box?</Label>
      <Input
        placeholder="comma seperated items in the box"
        id="box_items"
        name="box_items"
        value={productForm.box_items}
        onChange={onChange}
      />
    </>
  );
}
