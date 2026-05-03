"use client";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
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
import {
  AlertTriangle,
  Check,
  ChevronsUpDown,
  Download,
  Info,
  Upload,
} from "lucide-react";
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
  const [storeOptions, setStoreOptions] =
    useState<TProductImportTargetStore[]>(initialStoreOptions);
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

  const template = guidePayload.guide.template;
  const templateRequiresStore = template.requires_target_store_uuid;
  const templateDisabled = templateRequiresStore && !selectedStoreUuid;
  const templateHref = templateRequiresStore
    ? `/products/import/template?target_store_uuid=${encodeURIComponent(selectedStoreUuid)}`
    : "/products/import/template";

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

  const vendorTargetStore =
    eligibility.actor_type === "vendor" ? eligibility.target_store : null;

  return (
    <div className="space-y-4">
      <Card
        className={!eligibility.can_initiate ? "border-destructive" : undefined}
      >
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <CardTitle>New Bulk Product Import</CardTitle>
              <CardDescription>
                Download the catalog and template for this store, then upload a
                CSV (and image ZIP) to start validation.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {templateDisabled ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled
                  title="Select a target store to enable the template download."
                >
                  <Download className="mr-2 h-4 w-4" />
                  Template
                </Button>
              ) : (
                <Button asChild variant="outline" size="sm">
                  <Link href={templateHref}>
                    <Download className="mr-2 h-4 w-4" />
                    Template
                  </Link>
                </Button>
              )}
              {catalogDisabled ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled
                  title="Select a target store to enable the catalog download."
                >
                  <Download className="mr-2 h-4 w-4" />
                  Catalog
                </Button>
              ) : (
                <Button asChild variant="outline" size="sm">
                  <Link href={catalogHref} target="_blank" rel="noopener">
                    <Download className="mr-2 h-4 w-4" />
                    Catalog
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {eligibility.target_store_required ? (
            <div className="space-y-2">
              <Label>Target Store</Label>
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
                                {store.slug} · {store.sellable_category_count}{" "}
                                sellable categories
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
              {storeError ? (
                <p className="text-sm text-destructive">{storeError}</p>
              ) : initialStoreOptionsError ? (
                <p className="text-sm text-destructive">
                  {initialStoreOptionsError}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Only stores with sellable assigned categories are valid import
                  targets.
                </p>
              )}
            </div>
          ) : vendorTargetStore ? (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-md border bg-muted/30 px-3 py-2 text-sm">
              <span className="font-medium">{vendorTargetStore.name}</span>
              <span className="text-muted-foreground">
                {vendorTargetStore.slug}
              </span>
              <span className="text-muted-foreground">
                · {vendorTargetStore.sellable_category_count} sellable
                categories
              </span>
              <span
                className={cn(
                  "text-xs",
                  vendorTargetStore.product_authoring_ready
                    ? "text-emerald-600"
                    : "text-destructive",
                )}
              >
                {vendorTargetStore.product_authoring_ready
                  ? "· ready"
                  : "· not ready"}
              </span>
            </div>
          ) : null}

          {uploadBlockedReason ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              <span className="font-medium">{uploadBlockedReason.message}</span>
              {uploadBlockedReason.code === "store_required" ? (
                <Button asChild variant="outline" size="sm">
                  <Link
                    href={buildStoreRequirementPath("/products/imports/new")}
                  >
                    Create Your Store
                  </Link>
                </Button>
              ) : uploadBlockedReason.code === "store_not_ready" ? (
                <Button asChild variant="outline" size="sm">
                  <Link
                    href={buildStoreRemediationPath("/products/imports/new")}
                  >
                    Fix Store Readiness
                  </Link>
                </Button>
              ) : null}
            </div>
          ) : null}

          <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="space-y-1">
              <div className="font-medium">
                One{" "}
                <code className="rounded bg-amber-100 px-1">import_key</code> =
                one product
              </div>
              <div className="text-xs">
                Rows sharing the same{" "}
                <code className="rounded bg-amber-100 px-1">import_key</code>{" "}
                describe sellable SKUs of a single product and must (a) stay
                contiguous in the CSV and (b) keep these{" "}
                <strong>product-level columns identical</strong> on every row:{" "}
                <code className="rounded bg-amber-100 px-1">category_slug</code>
                , <code className="rounded bg-amber-100 px-1">name</code>,{" "}
                <code className="rounded bg-amber-100 px-1">description</code>,{" "}
                <code className="rounded bg-amber-100 px-1">highlights</code>,{" "}
                <code className="rounded bg-amber-100 px-1">box_items</code>,{" "}
                <code className="rounded bg-amber-100 px-1">base_price</code>,{" "}
                <code className="rounded bg-amber-100 px-1">product_sku</code>,{" "}
                <code className="rounded bg-amber-100 px-1">
                  product_image_filenames
                </code>
                ,{" "}
                <code className="rounded bg-amber-100 px-1">
                  specifications_json
                </code>
                . Only the{" "}
                <code className="rounded bg-amber-100 px-1">variant_*</code>{" "}
                columns should differ between rows. For an optionless product,
                keep exactly one row and set{" "}
                <code className="rounded bg-amber-100 px-1">
                  variant_attributes_json
                </code>{" "}
                to <code className="rounded bg-amber-100 px-1">{`{}`}</code> or
                leave it empty.
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="product-import-csv">
                CSV File{" "}
                <span className="text-xs text-muted-foreground">
                  (≤ {guidePayload.guide.constraints.csv_max_size_mb} MB)
                </span>
              </Label>
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
                <p className="text-xs text-destructive">{csvError}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Keep the template headers unchanged.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="product-import-zip">
                Image ZIP{" "}
                <span className="text-xs text-muted-foreground">
                  (≤ {guidePayload.guide.constraints.image_archive_max_size_mb}{" "}
                  MB, required by current image policy)
                </span>
              </Label>
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
                <p className="text-xs text-destructive">{imageArchiveError}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Current import policy expects referenced product and SKU
                  images to be present in the ZIP archive.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Validation runs before any product write. Unknown categories,
              attributes, or image filenames are rejected.
            </p>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={!eligibility.can_initiate || isPending}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isPending ? "Uploading..." : "Upload Package"}
            </Button>
          </div>

          <div className="rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            Use <code className="rounded bg-muted px-1">specifications.csv</code>{" "}
            from the catalog ZIP to map each{" "}
            <code className="rounded bg-muted px-1">specification_key</code> to
            its readable{" "}
            <code className="rounded bg-muted px-1">specification_label</code>{" "}
            and <code className="rounded bg-muted px-1">specification_type</code>.
            Keep <code className="rounded bg-muted px-1">specifications_json</code>{" "}
            keyed by <code className="rounded bg-muted px-1">specification_key</code>.
            Bulk import stays SKU-first: use{" "}
            <code className="rounded bg-muted px-1">variant_sku</code>,{" "}
            <code className="rounded bg-muted px-1">variant_price</code>,{" "}
            <code className="rounded bg-muted px-1">variant_stock</code>, and{" "}
            <code className="rounded bg-muted px-1">variant_available</code> for
            the concrete sellable SKU. Do not add product-level stock columns.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-2 sm:p-3">
          <Tabs defaultValue="grouping">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="grouping">Grouping Rules</TabsTrigger>
              <TabsTrigger value="prerequisites">Prerequisites</TabsTrigger>
              <TabsTrigger value="workflow">Workflow</TabsTrigger>
              <TabsTrigger value="images">Image Rules</TabsTrigger>
              <TabsTrigger value="fields">Field Guide</TabsTrigger>
            </TabsList>

            <TabsContent value="grouping" className="mt-3">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2 rounded-md border bg-muted/30 px-3 py-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {guidePayload.guide.constraints.grouping_rule}
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-md border p-3">
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Must be identical across rows
                    </div>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {[
                        "category_slug",
                        "name",
                        "description",
                        "highlights",
                        "box_items",
                        "base_price",
                        "product_sku",
                        "product_image_filenames",
                        "specifications_json",
                      ].map((col) => (
                        <li
                          key={col}
                          className="rounded bg-muted px-2 py-0.5 font-mono text-xs"
                        >
                          {col}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Should differ per row (SKU-level)
                    </div>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {[
                        "variant_sku",
                        "variant_price",
                        "variant_stock",
                        "variant_available",
                        "variant_image_filenames",
                        "variant_attributes_json",
                      ].map((col) => (
                        <li
                          key={col}
                          className="rounded bg-muted px-2 py-0.5 font-mono text-xs"
                        >
                          {col}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tip: to add more sellable SKUs, copy the first row for that
                  product
                  and only change the{" "}
                  <code className="rounded bg-muted px-1 font-mono">
                    variant_*
                  </code>{" "}
                  columns. Changing any product-level column between rows
                  sharing the same{" "}
                  <code className="rounded bg-muted px-1 font-mono">
                    import_key
                  </code>{" "}
                  rejects the whole group. Optionless products should keep a
                  single row only.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="prerequisites" className="mt-3">
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {guidePayload.guide.prerequisites.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border bg-muted/30 px-3 py-1.5"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="workflow" className="mt-3">
              <ol className="space-y-1.5 text-sm text-muted-foreground">
                {guidePayload.guide.workflow_steps.map((item, index) => (
                  <li
                    key={item}
                    className="rounded-md border bg-muted/30 px-3 py-1.5"
                  >
                    <span className="mr-2 font-medium text-foreground">
                      {index + 1}.
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </TabsContent>

            <TabsContent value="images" className="mt-3">
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {guidePayload.guide.image_rules.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border bg-muted/30 px-3 py-1.5"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="fields" className="mt-3">
              <ScrollArea className="h-[320px] rounded-md border">
                <div className="divide-y">
                  {guidePayload.guide.fields.map((field) => (
                    <div
                      key={field.key}
                      className="grid gap-2 p-3 md:grid-cols-[200px_1fr]"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{field.label}</span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {field.key}
                        </span>
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium",
                            field.required
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {field.required ? "Required" : "Optional"}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>{field.description}</p>
                        {field.example ? (
                          <div className="rounded border bg-muted/30 px-2 py-1 font-mono text-xs text-foreground">
                            {field.example}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
