import { CreateProductSchema } from "@/modules/product.management/config/schemas/product";
import { createOptionlessVariantPayload } from "@/modules/product.management/utils/productForm";
import assert from "node:assert/strict";

const variants = createOptionlessVariantPayload({
  productName: "Face Wash",
  productSku: "FACE-WASH",
  variant: {
    uuid: "11111111-1111-1111-1111-111111111111",
    name: "Face Wash",
    sku: "FACE-WASH-01",
    stock: "8",
    price: "110",
    available: true,
    images: [],
  },
});

assert.equal(variants.length, 1);
assert.deepEqual(variants[0], {
  uuid: "11111111-1111-1111-1111-111111111111",
  name: "Face Wash",
  sku: "FACE-WASH-01",
  stock: "8",
  price: "110",
  available: true,
  images: [],
});
assert.equal("attribute" in variants[0], false);

const variantValidation = CreateProductSchema.shape.variants.safeParse(
  createOptionlessVariantPayload({
    productName: "Face Wash Product",
    productSku: "FACE-WASH",
    variant: {
      sku: "FACE-WASH-01",
      stock: "8",
      price: "110",
      available: true,
      images: [],
      name: "Face Wash Product",
    },
  }),
);

assert.equal(variantValidation.success, true);
console.log("product optionless sku vendor assertions passed");
