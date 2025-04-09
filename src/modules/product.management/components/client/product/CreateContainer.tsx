"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { actionGetCategories } from "@/modules/product.management/actions/category";
import { Suspense, useState } from "react";
import { TCategory } from "@/modules/product.management";
import { Loader } from "lucide-react";
import CategoryDropdown from "@/modules/product.management/ui/CategoryDropdown";

export default function CreateContainer() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<TCategory[]>([]);
  const { data } = useSuspenseQuery({
    queryKey: ["allCategories"],
    queryFn: () => actionGetCategories({ rootOnly: true, sort: "name" }),
  });
  const rootCategories =
    (data?.data.payload.categories?.data as TCategory[]) || [];

  const [subCategories, setSubCategories] = useState<TCategory[]>([]);
  const [subChildCategories, setSubChildCategories] = useState<TCategory[]>([]);

  const [filters, setFilters] = useState({ root: "", sub: "", subchild: "" });

  if (data.metaData.error) {
    return <h1>Error: {data.metaData.error}</h1>;
  }
  const handleClickRoot = (category: TCategory) => {
    setSubCategories(category.children || []);
    setSubChildCategories([]);
    setSelectedCategories([category]);
  };

  const handleClickSub = (category: TCategory) => {
    setSubChildCategories(category.children || []);
    setSelectedCategories((prev) => [prev[0], category]);
  };

  const handleClickSubChild = (category: TCategory) => {
    setSelectedCategories((prev) => [prev[0], prev[1], category]);
    console.log(selectedCategories);
  };
  const updateFilter = (level: "root" | "sub" | "subchild", value: string) => {
    setFilters((prev) => ({ ...prev, [level]: value }));
  };
  console.log(selectedCategories[2]);
  return (
    <PageContainer pageTitle="Create Products">
      <ProductMediaCard title="Basic Information">
        <div className="flex-col w-full max-w-6xl items-center space-y-3">
          <Label htmlFor="product-name">Product Name</Label>
          <Input
            className="focus-visible:ring-primary"
            type="text"
            id="product-name"
            placeholder="Ex. Nikon Coolpix A300 Digital Camera"
          />
        </div>
        <Suspense fallback={<Loader />}>
          <div className="flex-col w-full max-w-6xl items-center space-y-3">
            <Label>Category</Label>
            <CategoryDropdown
              selectedCategories={selectedCategories}
              open={showDropdown}
              onOpenChangeAction={() => setShowDropdown(!showDropdown)}
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
        </Suspense>
      </ProductMediaCard>
      {selectedCategories?.length === 3 && (
        <>
          <ProductMediaCard title="Media" />
          {selectedCategories[2].specifications?.length > 0 && (
            <ProductMediaCard title="Product Specifications">
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                {selectedCategories[2].specifications_with_model.map(
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
                        <Input
                          name={`specifications[${specification.key}]`}
                          id={`specification-value-`.concat(specification.key)}
                          type={specification.type}
                          className="focus-visible:ring-primary"
                        />
                      )}
                    </div>
                  ),
                )}
              </div>
            </ProductMediaCard>
          )}

          {selectedCategories[2].attributes?.length > 0 && (
            <ProductMediaCard title="Product Variants" />
          )}
        </>
      )}
    </PageContainer>
  );
}

interface IProductCard {
  title: string;
  children?: React.ReactNode;
}

const ProductMediaCard = ({ title, children }: IProductCard) => (
  <Card>
    <CardHeader>
      <p className="text-lg font-semibold">{title}</p>
    </CardHeader>
    <CardContent className="flex-col space-y-7">{children}</CardContent>
  </Card>
);
