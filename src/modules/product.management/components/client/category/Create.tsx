"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getValidationFeedback } from "@/modules/core/lib/utils.validationFeedback";
import {
  TAttribute,
  TCategory,
  TSpecification,
} from "@/modules/product.management";
import { actionCreateCategory } from "@/modules/product.management/actions/category";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

type CategoryFeedback = {
  summary: string;
  fieldErrors: Record<string, string[]>;
} | null;

type ParentOption = {
  uuid: string;
  label: string;
};

interface CreateProps {
  categories: TCategory[];
  attributes: TAttribute[];
  specifications: TSpecification[];
}

const getFieldError = (
  feedback: CategoryFeedback,
  ...keys: string[]
): string | null => {
  if (!feedback) {
    return null;
  }

  for (const key of keys) {
    const message = feedback.fieldErrors[key]?.[0];
    if (message) {
      return message;
    }
  }

  return null;
};

const flattenParentOptions = (
  categories: TCategory[],
  path: string[] = [],
): ParentOption[] =>
  categories.flatMap((category) => {
    const nextPath = [...path, category.name];
    return [
      { uuid: category.uuid, label: nextPath.join(" / ") },
      ...flattenParentOptions(category.children ?? [], nextPath),
    ];
  });

export default function Create({
  categories,
  attributes,
  specifications,
}: CreateProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [parentUuid, setParentUuid] = useState<string>("");
  const [selectedAttributeUuids, setSelectedAttributeUuids] = useState<
    string[]
  >([]);
  const [selectedSpecificationUuids, setSelectedSpecificationUuids] = useState<
    string[]
  >([]);
  const [feedback, setFeedback] = useState<CategoryFeedback>(null);
  const [isParentPickerOpen, setIsParentPickerOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const parentOptions = useMemo(
    () => flattenParentOptions(categories),
    [categories],
  );

  const selectedParentLabel = useMemo(
    () =>
      parentOptions.find((option) => option.uuid === parentUuid)?.label ??
      "Root category",
    [parentOptions, parentUuid],
  );

  const isSellable = selectedAttributeUuids.length > 0;
  const nameError = getFieldError(feedback, "name");
  const parentError = getFieldError(feedback, "parent_uuid");
  const attributeError = getFieldError(
    feedback,
    "attributes",
    "attributes.0",
    "attributes.*",
  );
  const specificationError = getFieldError(
    feedback,
    "specifications",
    "specifications.0",
    "specifications.*",
  );

  const clearFieldError = (...keys: string[]) => {
    setFeedback((current) => {
      if (!current) {
        return current;
      }

      const nextFieldErrors = { ...current.fieldErrors };
      keys.forEach((key) => {
        delete nextFieldErrors[key];
      });

      return {
        ...current,
        fieldErrors: nextFieldErrors,
      };
    });
  };

  const toggleSelection = (
    value: string,
    setState: React.Dispatch<React.SetStateAction<string[]>>,
    keysToClear: string[],
  ) => {
    setState((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
    clearFieldError(...keysToClear);
  };

  const handleSubmit = () => {
    startTransition(() => {
      void actionCreateCategory({
        name,
        parent_uuid: parentUuid || null,
        attributes: selectedAttributeUuids,
        specifications: selectedSpecificationUuids,
      }).then((result) => {
        if (result && "data" in result && result.data.message === "success") {
          const createdSlug = result.data.payload.category.slug as string;
          toast.success("Category created successfully.");
          router.push(`/categories/${createdSlug}/view`);
          return;
        }

        const nextFeedback =
          result &&
          typeof result === "object" &&
          "summary" in result &&
          "fieldErrors" in result
            ? result
            : getValidationFeedback(
                result,
                "Please fix the highlighted fields.",
              );

        setFeedback(nextFeedback);
        toast.error(nextFeedback?.summary ?? "Unable to create category.");
      });
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <CardTitle>Create Category</CardTitle>
              <CardDescription>
                Build a taxonomy node, optionally place it under an existing
                parent, and define whether it becomes sellable by attaching
                attributes.
              </CardDescription>
            </div>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                isSellable
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {isSellable ? "Sellable on create" : "Browsable only on create"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-2">
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                clearFieldError("name");
              }}
              placeholder="For example: Face Serum"
              className={cn(nameError && "border-destructive ring-destructive")}
            />
            {nameError ? (
              <p className="text-sm text-destructive">{nameError}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Name drives the initial slug. The backend keeps slug generation
                authoritative.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Parent Category</Label>
            <Popover
              open={isParentPickerOpen}
              onOpenChange={setIsParentPickerOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-between",
                    parentError && "border-destructive ring-destructive",
                  )}
                >
                  <span className="truncate">{selectedParentLabel}</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[360px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search parent category..." />
                  <CommandList>
                    <CommandEmpty>No categories found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="Root category"
                        onSelect={() => {
                          setParentUuid("");
                          clearFieldError("parent_uuid");
                          setIsParentPickerOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            parentUuid === "" ? "opacity-100" : "opacity-0",
                          )}
                        />
                        Root category
                      </CommandItem>
                      {parentOptions.map((option) => (
                        <CommandItem
                          key={option.uuid}
                          value={option.label}
                          onSelect={() => {
                            setParentUuid(option.uuid);
                            clearFieldError("parent_uuid");
                            setIsParentPickerOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              parentUuid === option.uuid
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {parentError ? (
              <p className="text-sm text-destructive">{parentError}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Leave this at root when creating a top-level browse node.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attributes</CardTitle>
          <CardDescription>
            Attributes make the category sellable because variants are generated
            from attribute combinations.
          </CardDescription>
          {attributeError ? (
            <p className="text-sm font-medium text-destructive">
              {attributeError}
            </p>
          ) : null}
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-72 rounded-md border p-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {attributes.map((attribute) => (
                <label
                  key={attribute.uuid}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-3 transition-colors",
                    selectedAttributeUuids.includes(attribute.uuid)
                      ? "border-primary bg-primary/5"
                      : "border-border",
                  )}
                >
                  <Checkbox
                    checked={selectedAttributeUuids.includes(attribute.uuid)}
                    onCheckedChange={() =>
                      toggleSelection(
                        attribute.uuid,
                        setSelectedAttributeUuids,
                        ["attributes", "attributes.0", "attributes.*"],
                      )
                    }
                  />
                  <div className="space-y-1">
                    <div className="font-medium">{attribute.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {attribute.attribute_value.length} values available
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Specifications</CardTitle>
          <CardDescription>
            Specifications enrich product metadata, but they do not make the
            category sellable on their own.
          </CardDescription>
          {specificationError ? (
            <p className="text-sm font-medium text-destructive">
              {specificationError}
            </p>
          ) : null}
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-72 rounded-md border p-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {specifications.map((specification) => (
                <label
                  key={specification.uuid}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-3 transition-colors",
                    selectedSpecificationUuids.includes(specification.uuid)
                      ? "border-primary bg-primary/5"
                      : "border-border",
                  )}
                >
                  <Checkbox
                    checked={selectedSpecificationUuids.includes(
                      specification.uuid,
                    )}
                    onCheckedChange={() =>
                      toggleSelection(
                        specification.uuid,
                        setSelectedSpecificationUuids,
                        [
                          "specifications",
                          "specifications.0",
                          "specifications.*",
                        ],
                      )
                    }
                  />
                  <div className="space-y-1">
                    <div className="font-medium">
                      {specification.key.replaceAll("-", " ")}
                    </div>
                    <div className="text-xs uppercase text-muted-foreground">
                      {specification.type}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/categories")}
        >
          Cancel
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={isPending}>
          {isPending ? "Creating..." : "Create Category"}
        </Button>
      </div>
    </div>
  );
}
