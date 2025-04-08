"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  actionUpdateCategory,
  actionViewCategory,
} from "@/modules/product.management/actions";
import {
  TAttribute,
  TCategory,
  TSpecification,
} from "@/modules/product.management";
import { Loader } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function CategoryView({ slug }: { slug: string }) {
  const [category, setCategory] = useState<TCategory | null>(null);
  const [allSpecification, setAllSpecification] = useState<TSpecification[]>(
    [],
  );
  const [selectedSpecIds, setSelectedSpecsIds] = useState<string[]>([]);
  const [allAttributes, setAllAttributes] = useState<TAttribute[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);

  console.log(selectedAttributes);
  useEffect(() => {
    actionViewCategory(slug)
      .then((result) => {
        if (result?.data?.message) {
          const payload = result.data.payload;
          const category = payload["category"] as TCategory | undefined;
          const allSpecification = payload[
            "allSpecifications"
          ] as TSpecification[];
          const allAttributes = payload["allAttributes"] as TAttribute[];
          if (category) {
            setCategory(category);
            setSelectedSpecsIds(
              category.specifications?.map((spec) => spec.uuid) || [],
            );
            setSelectedAttributes(
              category.attributes?.map((attribute) => attribute.uuid) || [],
            );
          }
          if (allSpecification) setAllSpecification(allSpecification);
          if (allAttributes) setAllAttributes(allAttributes);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [slug]);
  if (category == null) {
    return <Loader />;
  }

  const { name, parent, position, children } = category;
  const handleSpecChange = (specId: string) => {
    setSelectedSpecsIds((prevState) =>
      prevState.includes(specId)
        ? prevState.filter((id) => id !== specId)
        : [...prevState, specId],
    );
  };
  const handleAttributeChange = (attrId: string) => {
    setSelectedAttributes((prevState) =>
      prevState.includes(attrId)
        ? prevState.filter((id) => id !== attrId)
        : [...prevState, attrId],
    );
  };
  const handleUpdateCategory = (entity: string) => {
    let body = null;
    if (entity === "attributes") {
      body = { attributes: selectedAttributes };
    }
    if (entity === "specifications") {
      body = { specifications: selectedSpecIds };
    }
    if (!body) alert("invalid request");
    actionUpdateCategory(slug, JSON.stringify(body)).then((result) => {
      console.log(result.data.message);
    });
  };
  return (
    <div className="flex-col space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex-col space-y-2">
            <DetailRow label="name" value={name} />
            <DetailRow label="position" value={position} />
            {parent && <DetailRow label="parent" value={parent.name} />}
            {children && children.length > 0 && (
              <DetailRow
                label="children"
                value={children.map((child) => child.name).join(", ")}
              />
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-lg">Attributes</CardTitle>
            <Button
              onClick={() => handleUpdateCategory("attributes")}
              className="hover:animate-pulse"
            >
              Update Attributes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 space-x-2">
            {allAttributes.length > 0
              ? allAttributes.map((item) => (
                  <div
                    className="uppercase flex space-x-2 items-center"
                    key={item.uuid}
                  >
                    <div>
                      <Checkbox
                        checked={selectedAttributes.includes(item.uuid)}
                        onClick={() => handleAttributeChange(item.uuid)}
                      />
                    </div>
                    <div>{item.name}</div>
                  </div>
                ))
              : "N/A"}
          </div>
        </CardContent>
      </Card>
      {children && children.length < 1 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle className="text-lg">Specifications</CardTitle>
              <Button
                className="hover:animate-pulse"
                onClick={() => handleUpdateCategory("specifications")}
              >
                Update Specifications
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 space-x-2">
              {allSpecification.length > 0
                ? allSpecification.map((item) => (
                    <div
                      className="uppercase flex space-x-2 items-center"
                      key={item.uuid}
                    >
                      <div>
                        <Checkbox
                          checked={selectedSpecIds.includes(item.uuid)}
                          onClick={() => handleSpecChange(item.uuid)}
                        />
                      </div>
                      <div>{item.key.replaceAll("-", " ")}</div>
                    </div>
                  ))
                : "N/A"}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center space-x-3">
    <div className="uppercase" id="column">
      {label}
    </div>
    <div>:</div>
    <div>{value}</div>
  </div>
);
