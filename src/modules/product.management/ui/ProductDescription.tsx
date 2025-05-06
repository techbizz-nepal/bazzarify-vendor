import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RefObject } from "react";

interface Props {
  productDescriptionRef: RefObject<HTMLTextAreaElement | null>;
  productHighlightsRef: RefObject<HTMLTextAreaElement | null>;
  productBoxItemsRef: RefObject<HTMLInputElement | null>;
}
export default function ProductDescription({
  productDescriptionRef,
  productHighlightsRef,
  productBoxItemsRef,
}: Props) {
  return (
    <div className="flex-col space-y-7">
      <Textarea
        ref={productDescriptionRef}
        id="product-description"
        name="product-description"
        rows={9}
        placeholder="Write a short product description here..."
        className="w-full rounded-md border px-3 py-2"
      />
      <Textarea
        ref={productHighlightsRef}
        id="product-highlight"
        name="product-highlights"
        rows={9}
        placeholder="Enter a minimum of three short highlights of the product"
        className="w-full rounded-md border px-3 py-2"
      />
      <Input
        ref={productBoxItemsRef}
        placeholder="comma seperated items in the box"
        id="box-items"
        name="boxItems"
      />
    </div>
  );
}
