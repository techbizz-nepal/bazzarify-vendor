"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TProductImportGuidePayload,
  TProductImportTargetStore,
} from "@/modules/product.management";
import {
  actionCreateProductImport,
  actionGetProductImportTargetStores,
} from "@/modules/product.management/actions/import";
import {
  buildStoreRemediationPath,
  buildStoreRequirementPath,
} from "@/modules/vendor/domain/storeRequirementNavigation";
import { Check, ChevronsUpDown, Download, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

type ValidationFeedback = {
  summary: string;
  fieldErrors: Record<string, string[]>;
};

const getFieldError = (
  feedback: ValidationFeedback | null,
  key: string,
): string | null => feedback?.fieldErrors[key]?.[0] ?? null;

interface ProductImportUploadFormProps {
  guidePayload: TProductImportGuidePayload;
  initialStoreOptions: TProductImportTargetStore[];
  initialStoreOptionsError?: string | null;
}

export default function ProductImportUploadForm({
  guidePayload,
  initialStoreOptions,
  initialStoreOptionsError,
}: ProductImportUploadFormProps) {
  const router = useRouter();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [imageArchiveFile, setImageArchiveFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<ValidationFeedback | null>(null);
  const [storeOptions, setStoreOptions] = useState<TProductImportTargetStore[]>(
    initialStoreOptions,
  );
  const [storeSearch, setStoreSearch] = useState("");
  const [selectedStoreUuid, setSelectedStoreUuid] = useState(
    guidePayload.eligibility.target_store?.uuid ?? "",
  );
  const [selectedStoreName, setSelectedStoreName] = useState(
    guidePayload.eligibility.target_store?.name ?? "",
  );
  const [isStorePickerOpen, setIsStorePickerOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSearchingStores, startStoreSearchTransition] = useTransition();
  const idempotencyKeyRef = useRef<string>(uuidv4());

  const eligibility = guidePayload.eligibility;
  const csvError = getFieldError(feedback, "csv");
  const imageArchiveError = getFieldError(feedback, "image_archive");
  const storeError = getFieldError(feedback, "store_uuid");
  const uploadBlockedReason = eligibility.blocking_reasons[0] ?? null;

  const catalog = guidePayload.guide.catalog;
  const catalogRequiresStore = catalog.requires_target_store_uuid;
  const catalogDisabled = catalogRequiresStore && !selectedStoreUuid;
  const catalogHref = catalogRequiresStore
    ? `/products/imports/catalog?target_store_uuid=${encodeURIComponent(selectedStoreUuid)}`
    : "/products/imports/catalog";

  const selectedStoreLabel = useMemo(() => {
    if (selectedStoreName) return selectedStoreName;
    return (
      storeOptions.find((store) => store.uuid === selectedStoreUuid)?.name ??
      "Select target store"
    );
  }, [selectedStoreName, selectedStoreUuid, storeOptions]);

  const clearFieldError = (field: string) => {
    setFeedback((current) => {
      if (!current) return current;
      const nextFieldErrors = { ...current.fieldErrors };
      delete nextFieldErrors[field];
      return { ...current, fieldErrors: nextFieldErrors };
    });
  };

  const handleStoreSearch = () => {
    startStoreSearchTransition(() => {
      void actionGetProductImportTargetStores(storeSearch).then((result) => {
        if (result && typeof result === "object" && "error" in result) {
          toast.error(result.error);
          return;
        }
        setStoreOptions(result.stores);
      });
    });
  };

  const rotateIdempotencyKey = () => {
    idempotencyKeyRef.current = uuidv4();
  };

  const handleUpload = () => {
    const nextFieldErrors: Record<string, string[]> = {};
    if (!csvFile) {
      nextFieldErrors.csv = ["Select a CSV file before uploading."];
    }
    if (eligibility.target_store_required && !selectedStoreUuid) {
      nextFieldErrors.store_uuid = ["Select a target store before uploading."];
    }
    if (Object.keys(nextFieldErrors).length > 0) {
      setFeedback({
        summary: "Please fix the highlighted import fields.",
        fieldErrors: nextFieldErrors,
      });
      return;
    }

    startTransition(() => {
      const formData = new FormData();
      if (csvFile) formData.append("csv", csvFile);
      if (imageArchiveFile) formData.append("image_archive", imageArchiveFile);
      if (eligibility.target_store_required && selectedStoreUuid) {
        formData.append("store_uuid", selectedStoreUuid);
      }

      void actionCreateProductImport(formData, idempotencyKeyRef.current).then(
        (result) => {
          if (result && typeof result === "object" && "redirectTo" in result) {
            toast.message(
              "An import is already in progress. Redirecting to the active one.",
            );
            router.push(result.redirectTo);
            return;
          }

          if (result && typeof result === "object" && "import" in result) {
            toast.success("Import package uploaded.");
            rotateIdempotencyKey();
            router.push(`/products/imports/${result.import.uuid}`);
            return;
          }

          if (result && typeof result === "object" && "summary" in result) {
            setFeedback(result);
            toast.error(result.summary);
            rotateIdempotencyKey();
            return;
          }

          toast.error(result.error);
          rotateIdempotencyKey();
        },
      );
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <CardTitle>New Bulk Product Import</CardTitle>
              <CardDescription>
                Upload a validated CSV (and image ZIP if referenced), then drive
                validation and processing from the import detail page.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild variant="outline">
                <Link href={guidePayload.guide.template.api_path}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Sample CSV
                </Link>
              </Button>
              {catalogDisabled ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled
                  title="Select a target store to enable the catalog download."
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Catalog
                </Button>
              ) : (
                <Button asChild variant="outline">
                  <Link href={catalogHref} target="_blank" rel="noopener">
                    <Download className="mr-2 h-4 w-4" />
                    Download Catalog
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Use the exact category slugs, specification keys, attribute names,
            and values from the catalog to avoid validation errors.
          </p>
        </CardHeader>
        <CardContent className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Prerequisites</h3>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                {guidePayload.guide.prerequisites.map((item) => (
                  <li key={item} className="rounded-md border bg-muted/30 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Image Packaging Rules</h3>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                {guidePayload.guide.image_rules.map((item) => (
                  <li key={item} className="rounded-md border bg-muted/30 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Workflow</h3>
              <ol className="mt-2 space-y-2 text-sm text-muted-foreground">
                {guidePayload.guide.workflow_steps.map((item, index) => (
                  <li key={item} className="rounded-md border bg-muted/30 px-3 py-2">
                    {index + 1}. {item}
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-md border bg-slate-50 p-4 text-sm text-slate-700">
              <div className="font-medium text-slate-900">Upload limits</div>
              <div className="mt-2 space-y-1">
                <p>CSV: up to {guidePayload.guide.constraints.csv_max_size_mb} MB</p>
                <p>
                  Image ZIP: up to{" "}
                  {guidePayload.guide.constraints.image_archive_max_size_mb} MB
                </p>
                <p>{guidePayload.guide.constraints.grouping_rule}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Field Guide</CardTitle>
          <CardDescription>
            The backend owns the import contract. Keep headers unchanged and use
            existing category, attribute, and attribute-value data already
            present in Bazarify.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[360px] rounded-md border">
            <div className="divide-y">
              {guidePayload.guide.fields.map((field) => (
                <div
                  key={field.key}
                  className="grid gap-3 p-4 md:grid-cols-[220px_1fr]"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{field.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {field.key}
                    </div>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-1 text-xs font-medium",
                        field.required
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {field.required ? "Required" : "Optional"}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>{field.description}</p>
                    {field.example ? (
                      <div className="rounded-md border bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700">
                        {field.example}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className={!eligibility.can_initiate ? "border-destructive" : undefined}>
        <CardHeader>
          <CardTitle>Eligibility</CardTitle>
          <CardDescription>
            Bulk import cannot bypass the existing store and category authority
            model.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {eligibility.actor_type === "vendor" && eligibility.target_store ? (
            <div className="rounded-md border bg-slate-50 p-4 text-sm text-slate-700">
              <div className="font-medium text-slate-900">
                {eligibility.target_store.name}
              </div>
              <div className="mt-2 space-y-1">
                <p>Slug: {eligibility.target_store.slug}</p>
                <p>
                  Sellable assigned categories:{" "}
                  {eligibility.target_store.sellable_category_count}
                </p>
                <p>
                  Product authoring ready:{" "}
                  {eligibility.target_store.product_authoring_ready ? "Yes" : "No"}
                </p>
              </div>
            </div>
          ) : null}

          {eligibility.target_store_required ? (
            <div className="space-y-3">
              <Label>Target Store</Label>
              <div className="flex gap-3">
                <Popover
                  open={isStorePickerOpen}
                  onOpenChange={setIsStorePickerOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-between",
                        storeError && "border-destructive",
                      )}
                    >
                      <span className="truncate">{selectedStoreLabel}</span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[420px] p-0" align="start">
                    <Command shouldFilter={false}>
                      <div className="flex items-center gap-2 border-b p-2">
                        <CommandInput
                          placeholder="Search stores..."
                          value={storeSearch}
                          onValueChange={setStoreSearch}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleStoreSearch}
                          disabled={isSearchingStores}
                        >
                          {isSearchingStores ? "Searching..." : "Search"}
                        </Button>
                      </div>
                      <CommandList>
                        <CommandEmpty>No stores found.</CommandEmpty>
                        <CommandGroup>
                          {storeOptions.map((store) => (
                            <CommandItem
                              key={store.uuid}
                              value={store.name}
                              disabled={!store.product_authoring_ready}
                              onSelect={() => {
                                setSelectedStoreUuid(store.uuid);
                                setSelectedStoreName(store.name);
                                clearFieldError("store_uuid");
                                setIsStorePickerOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedStoreUuid === store.uuid
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{store.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {store.slug} ·{" "}
                                  {store.sellable_category_count} sellable categories
                                  {!store.product_authoring_ready
                                    ? " · not ready"
                                    : ""}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              {storeError ? (
                <p className="text-sm text-destructive">{storeError}</p>
              ) : initialStoreOptionsError ? (
                <p className="text-sm text-destructive">{initialStoreOptionsError}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Only stores with sellable assigned categories are valid import
                  targets.
                </p>
              )}
            </div>
          ) : null}

          {uploadBlockedReason ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
              <div className="font-medium">{uploadBlockedReason.message}</div>
              <div className="mt-3">
                {uploadBlockedReason.code === "store_required" ? (
                  <Button asChild variant="outline">
                    <Link href={buildStoreRequirementPath("/products/imports/new")}>
                      Create Your Store
                    </Link>
                  </Button>
                ) : uploadBlockedReason.code === "store_not_ready" ? (
                  <Button asChild variant="outline">
                    <Link href={buildStoreRemediationPath("/products/imports/new")}>
                      Fix Store Readiness
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="rounded-md border bg-primary/5 p-4 text-sm text-foreground">
              Import can start once your CSV package is uploaded. Validation
              will stop unknown categories, attribute values, image filenames,
              and malformed variant combinations before any product write
              occurs.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Package</CardTitle>
          <CardDescription>
            After upload you will be redirected to the import detail page where
            you can validate and process rows.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product-import-csv">CSV File</Label>
              <Input
                id="product-import-csv"
                type="file"
                accept=".csv,text/csv"
                className={cn(csvError && "border-destructive")}
                onChange={(event) => {
                  setCsvFile(event.target.files?.[0] ?? null);
                  clearFieldError("csv");
                }}
                disabled={!eligibility.can_initiate}
              />
              {csvError ? (
                <p className="text-sm text-destructive">{csvError}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Use the downloaded sample template and keep the header order
                  intact.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-import-zip">Image ZIP (optional)</Label>
              <Input
                id="product-import-zip"
                type="file"
                accept=".zip,application/zip"
                className={cn(imageArchiveError && "border-destructive")}
                onChange={(event) => {
                  setImageArchiveFile(event.target.files?.[0] ?? null);
                  clearFieldError("image_archive");
                }}
                disabled={!eligibility.can_initiate}
              />
              {imageArchiveError ? (
                <p className="text-sm text-destructive">{imageArchiveError}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Required only when the CSV references product or variant
                  image filenames.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={handleUpload}
              disabled={!eligibility.can_initiate || isPending}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isPending ? "Uploading..." : "Upload Package"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
