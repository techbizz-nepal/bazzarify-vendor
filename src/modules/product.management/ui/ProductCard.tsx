import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import { IProductCard } from "@/modules/product.management";

const ProductCard = ({ title, children }: IProductCard) => (
  <Card>
    <CardHeader>
      <p className="text-lg font-semibold">{title}</p>
    </CardHeader>
    <CardContent className="flex-col space-y-7">{children}</CardContent>
  </Card>
);

export default ProductCard;
