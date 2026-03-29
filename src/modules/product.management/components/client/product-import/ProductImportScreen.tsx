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
import { Separator } from "@/components/ui/separator";
import {
  TProductImportGuidePayload,
  TProductImportProcessPayload,
  TProductImportRecord,
  TProductImportRow,
  TProductImportTargetStore,
} from "@/modules/product.management";
import {
  actionCreateProductImport,
  actionGetProductImport,
  actionGetProductImportTargetStores,
  actionProcessProductImport,
  actionValidateProductImport,
} from "@/modules/product.management/actions/import";
import {
  buildStoreRemediationPath,
  buildStoreRequirementPath,
} from "@/modules/vendor/domain/storeRequirementNavigation";
import { Check, ChevronsUpDown, Download, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

type ValidationFeedback = {
  summary: string;
  fieldErrors: Record<string, string[]>;
};

const flattenMessages = (value: unknown): string[] => {
  if (typeof value === "string") {
    return value.trim() ? [value] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => flattenMessages(entry));
  }

  if (typeof value === "object" && value !== null) {
    return Object.values(value).flatMap((entry) => flattenMessages(entry));
  }

  return [];
};

const getFieldError = (
  feedback: ValidationFeedback | null,
  key: string,
): string | null => feedback?.fieldErrors[key]?.[0] ?? null;

const statusClassName = (status: string | null | undefined) => {
  switch (status) {
    case "ready":
    case "completed":
      return "bg-primary text-primary-foreground";
    case "completed_with_errors":
      return "bg-amber-100 text-amber-900";
    case "failed":
    case "invalid":
      return "bg-destructive/10 text-destructive";
    case "processing":
    case "validating":
      return "bg-blue-100 text-blue-900";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const TERMINAL_IMPORT_STATUSES = new Set([
  "completed",
  "completed_with_errors",
  "failed",
]);

const buildProcessResultFromImport = (
  importRecord: TProductImportRecord,
): TProductImportProcessPayload["result"] => {
  const summary = importRecord.summary ?? {};
  const sampleFailures = Array.isArray(summary.sample_failures)
    ? summary.sample_failures
        .map((entry) => {
          if (typeof entry !== "object" || entry === null) {
            return null;
          }

          return {
            import_key:
              typeof entry.import_key === "string" ? entry.import_key : "",
            row_numbers: Array.isArray(entry.row_numbers)
              ? entry.row_numbers.filter(
                  (value: unknown): value is number => typeof value === "number",
                )
              : [],
            message: typeof entry.message === "string" ? entry.message : "",
          };
        })
        .filter(
          (
            entry,
          ): entry is {
            import_key: string;
            row_numbers: number[];
            message: string;
          } => Boolean(entry),
        )
    : [];

  return {
    processed_rows: importRecord.processed_rows,
    succeeded_rows: importRecord.succeeded_rows,
    failed_rows: importRecord.failed_rows,
    status: importRecord.status ?? "unknown",
    sample_failures: sampleFailures,
    idempotent_replay: false,
  };
};

interface ProductImportScreenProps {
  guidePayload: TProductImportGuidePayload;
  initialStoreOptions: TProductImportTargetStore[];
  initialStoreOptionsError?: string | null;
}

export default function ProductImportScreen({
  guidePayload,
  initialStoreOptions,
  initialStoreOptionsError,
}: ProductImportScreenProps) {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [imageArchiveFile, setImageArchiveFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<ValidationFeedback | null>(null);
  const [currentImport, setCurrentImport] = useState<TProductImportRecord | null>(
    null,
  );
  const [validatedRows, setValidatedRows] = useState<TProductImportRow[]>([]);
  const [processResult, setProcessResult] = useState<TProductImportProcessPayload["result"] | null>(null);
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

  const eligibility = guidePayload.eligibility;
  const csvError = getFieldError(feedback, "csv");
  const imageArchiveError = getFieldError(feedback, "image_archive");
  const storeError = getFieldError(feedback, "store_uuid");
  const uploadBlockedReason = eligibility.blocking_reasons[0] ?? null;

  const selectedStoreLabel = useMemo(() => {
    if (selectedStoreName) {
      return selectedStoreName;
    }

    return (
      storeOptions.find((store) => store.uuid === selectedStoreUuid)?.name ??
      "Select target store"
    );
  }, [selectedStoreName, selectedStoreUuid, storeOptions]);

  const clearFieldError = (field: string) => {
    setFeedback((current) => {
      if (!current) {
        return current;
      }

      const nextFieldErrors = { ...current.fieldErrors };
      delete nextFieldErrors[field];

      return {
        ...current,
        fieldErrors: nextFieldErrors,
      };
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
      if (csvFile) {
        formData.append("csv", csvFile);
      }
      if (imageArchiveFile) {
        formData.append("image_archive", imageArchiveFile);
      }
      if (eligibility.target_store_required && selectedStoreUuid) {
        formData.append("store_uuid", selectedStoreUuid);
      }

      void actionCreateProductImport(formData).then((result) => {
        if (result && typeof result === "object" && "import" in result) {
          setCurrentImport(result.import);
          setValidatedRows([]);
          setProcessResult(null);
          setFeedback(null);
          toast.success("Import package uploaded. Validate it before processing.");
          return;
        }

        if (result && typeof result === "object" && "summary" in result) {
          setFeedback(result);
          toast.error(result.summary);
          return;
        }

        toast.error(result.error);
      });
    });
  };

  const handleValidate = () => {
    if (!currentImport?.uuid) {
      toast.error("Upload an import package first.");
      return;
    }

    startTransition(() => {
      void actionValidateProductImport(currentImport.uuid).then((result) => {
        if (result && typeof result === "object" && "import" in result && "rows" in result) {
          setCurrentImport(result.import);
          setValidatedRows(result.rows);
          setProcessResult(null);
          toast.success(
            result.import.invalid_rows > 0
              ? "Validation finished with row issues."
              : "Validation finished successfully.",
          );
          return;
        }

        if (result && typeof result === "object" && "summary" in result) {
          toast.error(result.summary);
          return;
        }

        toast.error(result.error);
      });
    });
  };

  const handleProcess = () => {
    if (!currentImport?.uuid) {
      toast.error("Validate an import package first.");
      return;
    }

    startTransition(() => {
      void actionProcessProductImport(currentImport.uuid).then((result) => {
        if (result && typeof result === "object" && "import" in result && "result" in result) {
          setCurrentImport(result.import);
          if (result.result.status === "processing" || result.result.queued) {
            setProcessResult(null);
            toast.success(
              result.result.message ?? "Import processing has been queued.",
            );
            return;
          }

          setProcessResult(result.result);
          toast.success(
            result.result.idempotent_replay
              ? result.result.message ?? "Returning the existing import result."
              : "Import processing finished.",
          );
          return;
        }

        if (result && typeof result === "object" && "summary" in result) {
          toast.error(result.summary);
          return;
        }

        toast.error(result.error);
      });
    });
  };

  const summaryMessage =
    currentImport?.summary &&
    typeof currentImport.summary.message === "string"
      ? currentImport.summary.message
      : null;

  useEffect(() => {
    if (!currentImport?.uuid || currentImport.status !== "processing") {
      return;
    }

    let cancelled = false;

    const timeoutId = window.setTimeout(() => {
      void actionGetProductImport(currentImport.uuid).then((result) => {
        if (cancelled || !result || typeof result !== "object") {
          return;
        }

        if ("error" in result) {
          console.error("[product-import-poll]", {
            import_uuid: currentImport.uuid,
            error: result.error,
          });
          return;
        }

        setCurrentImport(result.import);

        if (result.import.status && TERMINAL_IMPORT_STATUSES.has(result.import.status)) {
          setProcessResult(buildProcessResultFromImport(result.import));

          if (result.import.failed_rows > 0) {
            toast.error("Import finished with processing failures.");
          } else {
            toast.success("Import completed successfully.");
          }
        }
      });
    }, 1500);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [currentImport]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <CardTitle>Bulk Import Products By CSV</CardTitle>
              <CardDescription>
                Use the sample CSV, validate every row first, then process the
                import through the existing backend product-authoring pipeline.
              </CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/products/import/template">
                <Download className="mr-2 h-4 w-4" />
                Download Sample CSV
              </Link>
            </Button>
          </div>
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
            The backend owns this import contract. Keep headers unchanged and
            use existing category, attribute, and attribute-value data already
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
            Bulk import cannot bypass the existing store and category authority model.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {eligibility.actor_type === "vendor" && eligibility.target_store ? (
            <div className="rounded-md border bg-slate-50 p-4 text-sm text-slate-700">
              <div className="font-medium text-slate-900">{eligibility.target_store.name}</div>
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
                                  {store.slug} · {store.sellable_category_count} sellable categories
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
                  Only stores with sellable assigned categories are valid import targets.
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
                    <Link href={buildStoreRequirementPath("/products/import")}>
                      Create Your Store
                    </Link>
                  </Button>
                ) : uploadBlockedReason.code === "store_not_ready" ? (
                  <Button asChild variant="outline">
                    <Link href={buildStoreRemediationPath("/products/import")}>
                      Fix Store Readiness
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="rounded-md border bg-primary/5 p-4 text-sm text-foreground">
              Import can start once your CSV package is uploaded. Validation will
              stop unknown categories, attribute values, image filenames, and
              malformed variant combinations before any product write occurs.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload And Validate</CardTitle>
          <CardDescription>
            Upload the CSV package first. Validation is a separate step so you
            get a full report before product creation begins.
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
                  Use the downloaded sample template and keep the header order intact.
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
                  Required only when the CSV references product or variant image filenames.
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
            <Button
              type="button"
              variant="outline"
              onClick={handleValidate}
              disabled={!currentImport?.uuid || isPending}
            >
              {isPending ? "Working..." : "Validate Rows"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleProcess}
              disabled={!currentImport?.uuid || currentImport.status !== "ready" || isPending}
            >
              {isPending ? "Processing..." : "Process Import"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {currentImport ? (
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>Current Import</CardTitle>
                <CardDescription>
                  Review upload, validation, and processing progress from one place.
                </CardDescription>
              </div>
              <span
                className={cn(
                  "inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium uppercase",
                  statusClassName(currentImport.status),
                )}
              >
                {currentImport.status ?? "unknown"}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground">Rows</div>
                <div className="mt-2 text-2xl font-semibold">{currentImport.total_rows}</div>
              </div>
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground">Valid / Invalid</div>
                <div className="mt-2 text-2xl font-semibold">
                  {currentImport.valid_rows} / {currentImport.invalid_rows}
                </div>
              </div>
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground">Processed</div>
                <div className="mt-2 text-2xl font-semibold">
                  {currentImport.processed_rows}
                </div>
              </div>
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground">Succeeded / Failed</div>
                <div className="mt-2 text-2xl font-semibold">
                  {currentImport.succeeded_rows} / {currentImport.failed_rows}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {Math.round(currentImport.progress_percentage)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{ width: `${Math.max(0, Math.min(100, currentImport.progress_percentage))}%` }}
                />
              </div>
            </div>

            {summaryMessage ? (
              <div className="rounded-md border bg-slate-50 p-4 text-sm text-slate-700">
                {summaryMessage}
              </div>
            ) : null}

            {currentImport.status === "processing" ? (
              <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                Import processing is running in the background. This page is
                polling backend status so you can track progress without
                re-submitting the import.
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {validatedRows.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Validation Review</CardTitle>
            <CardDescription>
              Full row feedback arrives before processing so you can correct the CSV and retry cleanly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[420px] rounded-md border">
              <div className="divide-y">
                {validatedRows.map((row) => {
                  const errorMessages = flattenMessages(row.errors);
                  const suggestionMessages = flattenMessages(row.suggestions);

                  return (
                    <div key={row.uuid} className="space-y-3 p-4">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div className="font-medium">Row {row.row_number}</div>
                        <span
                          className={cn(
                            "inline-flex w-fit rounded-full px-2 py-1 text-xs font-medium uppercase",
                            statusClassName(row.status),
                          )}
                        >
                          {row.status ?? "unknown"}
                        </span>
                      </div>

                      {errorMessages.length > 0 ? (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-destructive">Errors</div>
                          <ul className="space-y-2 text-sm text-destructive">
                            {errorMessages.map((message, index) => (
                              <li
                                key={`${row.uuid}-error-${index}`}
                                className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2"
                              >
                                {message}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {suggestionMessages.length > 0 ? (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-foreground">Suggestions</div>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            {suggestionMessages.map((message, index) => (
                              <li
                                key={`${row.uuid}-suggestion-${index}`}
                                className="rounded-md border bg-muted/30 px-3 py-2"
                              >
                                {message}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {row.normalized_payload ? (
                        <>
                          <Separator />
                          <pre className="overflow-x-auto rounded-md bg-slate-950/95 p-3 text-xs text-slate-100">
                            {JSON.stringify(row.normalized_payload, null, 2)}
                          </pre>
                        </>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      ) : null}

      {processResult ? (
        <Card>
          <CardHeader>
            <CardTitle>Processing Result</CardTitle>
            <CardDescription>
              Processing is idempotent at the import boundary. Re-running a finished import replays the persisted result instead of creating duplicate products.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground">Processed</div>
                <div className="mt-2 text-2xl font-semibold">{processResult.processed_rows}</div>
              </div>
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground">Succeeded</div>
                <div className="mt-2 text-2xl font-semibold">{processResult.succeeded_rows}</div>
              </div>
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground">Failed</div>
                <div className="mt-2 text-2xl font-semibold">{processResult.failed_rows}</div>
              </div>
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground">Replay</div>
                <div className="mt-2 text-2xl font-semibold">
                  {processResult.idempotent_replay ? "Yes" : "No"}
                </div>
              </div>
            </div>

            {processResult.sample_failures.length > 0 ? (
              <div className="space-y-3">
                <div className="font-medium">Sample Failures</div>
                <div className="space-y-3">
                  {processResult.sample_failures.map((failure, index) => (
                    <div
                      key={`${failure.import_key}-${index}`}
                      className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"
                    >
                      <div className="font-medium">{failure.import_key}</div>
                      <div className="mt-1">Rows: {failure.row_numbers.join(", ")}</div>
                      <div className="mt-2">{failure.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-md border bg-primary/5 p-4 text-sm text-foreground">
                No sampled failures were reported for the processed import.
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
