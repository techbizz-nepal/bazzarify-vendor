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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  TProductImportProcessPayload,
  TProductImportRecord,
  TProductImportRow,
} from "@/modules/product.management";
import {
  actionCancelProductImport,
  actionGetProductImport,
  actionProcessProductImport,
  actionValidateProductImport,
} from "@/modules/product.management/actions/import";
import { Download } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

const flattenMessages = (value: unknown): string[] => {
  if (typeof value === "string") return value.trim() ? [value] : [];
  if (Array.isArray(value)) return value.flatMap((entry) => flattenMessages(entry));
  if (typeof value === "object" && value !== null) {
    return Object.values(value).flatMap((entry) => flattenMessages(entry));
  }
  return [];
};

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
    case "cancelled":
      return "bg-muted text-muted-foreground";
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
  "cancelled",
]);

const CANCELLABLE_STATUSES = new Set([
  "uploaded",
  "validating",
  "validation_failed",
  "ready",
  "processing",
]);

const POLL_INITIAL_DELAY_MS = 2_000;
const POLL_MAX_DELAY_MS = 10_000;
const POLL_BACKOFF_FACTOR = 1.5;
const POLL_STUCK_THRESHOLD_MS = 10 * 60 * 1_000;

const buildProcessResultFromImport = (
  importRecord: TProductImportRecord,
): TProductImportProcessPayload["result"] => {
  const summary = importRecord.summary ?? {};
  const sampleFailures = Array.isArray(summary.sample_failures)
    ? summary.sample_failures
        .map((entry) => {
          if (typeof entry !== "object" || entry === null) return null;
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

interface ProductImportDetailScreenProps {
  initialImport: TProductImportRecord;
  initialRows?: TProductImportRow[];
  showResumedBanner?: boolean;
}

export default function ProductImportDetailScreen({
  initialImport,
  initialRows,
  showResumedBanner,
}: ProductImportDetailScreenProps) {
  const router = useRouter();
  const [currentImport, setCurrentImport] = useState<TProductImportRecord>(initialImport);
  const [validatedRows, setValidatedRows] = useState<TProductImportRow[]>(
    initialRows ?? [],
  );
  const [processResult, setProcessResult] = useState<
    TProductImportProcessPayload["result"] | null
  >(null);
  const [isPending, startTransition] = useTransition();

  const handleValidate = () => {
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

  const handleCancel = () => {
    if (
      !window.confirm(
        "Cancel this import? Staged artifacts will be cleaned up and the concurrency slot released.",
      )
    ) {
      return;
    }

    startTransition(() => {
      void actionCancelProductImport(currentImport.uuid).then((result) => {
        if (result && typeof result === "object" && "import" in result) {
          setCurrentImport(result.import);
          toast.success("Import cancelled.");
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

  useEffect(() => {
    if (!currentImport?.uuid || currentImport.status !== "processing") {
      return;
    }

    const importUuid = currentImport.uuid;
    let cancelled = false;
    let timeoutId: number | null = null;
    let delayMs = POLL_INITIAL_DELAY_MS;
    let stuckWarned = false;
    const pollStartedAt = Date.now();

    const schedulePoll = (nextDelayMs: number) => {
      timeoutId = window.setTimeout(() => {
        void actionGetProductImport(importUuid).then((result) => {
          if (cancelled) return;

          if (!result || typeof result !== "object" || "error" in result) {
            delayMs = Math.min(delayMs * POLL_BACKOFF_FACTOR, POLL_MAX_DELAY_MS);
            schedulePoll(delayMs);
            return;
          }

          setCurrentImport(result.import);

          if (
            result.import.status &&
            TERMINAL_IMPORT_STATUSES.has(result.import.status)
          ) {
            setProcessResult(buildProcessResultFromImport(result.import));
            if (result.import.status === "cancelled") {
              toast("Import was cancelled.");
            } else if (result.import.failed_rows > 0) {
              toast.error("Import finished with processing failures.");
            } else {
              toast.success("Import completed successfully.");
            }
            return;
          }

          if (
            !stuckWarned &&
            Date.now() - pollStartedAt > POLL_STUCK_THRESHOLD_MS
          ) {
            stuckWarned = true;
            toast.error(
              "Import is taking longer than expected. Refresh the page or contact support if it does not finish soon.",
            );
          }

          delayMs = Math.min(delayMs * POLL_BACKOFF_FACTOR, POLL_MAX_DELAY_MS);
          schedulePoll(delayMs);
        });
      }, nextDelayMs);
    };

    schedulePoll(delayMs);

    return () => {
      cancelled = true;
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, [currentImport]);

  const summaryMessage =
    currentImport.summary && typeof currentImport.summary.message === "string"
      ? currentImport.summary.message
      : null;

  const canCancel =
    currentImport.status !== null &&
    CANCELLABLE_STATUSES.has(currentImport.status);

  return (
    <div className="space-y-6">
      {showResumedBanner ? (
        <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          You were redirected to your in-flight import. Validate, process, or
          cancel it here before starting a new one.
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>
                Import {currentImport.source_filename ?? currentImport.uuid}
              </CardTitle>
              <CardDescription>
                {currentImport.target_store?.name ?? "—"} · {currentImport.uuid}
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium uppercase",
                  statusClassName(currentImport.status),
                )}
              >
                {currentImport.status ?? "unknown"}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/products/imports")}
              >
                All imports
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-md border p-4">
              <div className="text-sm text-muted-foreground">Rows</div>
              <div className="mt-2 text-2xl font-semibold">
                {currentImport.total_rows}
              </div>
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
              <div className="text-sm text-muted-foreground">
                Succeeded / Failed
              </div>
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
                style={{
                  width: `${Math.max(0, Math.min(100, currentImport.progress_percentage))}%`,
                }}
              />
            </div>
          </div>

          {summaryMessage ? (
            <div className="rounded-md border bg-slate-50 p-4 text-sm text-slate-700">
              {summaryMessage}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleValidate}
              disabled={isPending}
            >
              {isPending ? "Working..." : "Validate Rows"}
            </Button>
            <Button
              type="button"
              onClick={handleProcess}
              disabled={currentImport.status !== "ready" || isPending}
            >
              {isPending ? "Processing..." : "Process Import"}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleCancel}
              disabled={!canCancel || isPending}
            >
              Cancel Import
            </Button>
            {currentImport.status &&
            ["validation_failed", "completed_with_errors", "failed"].includes(
              currentImport.status,
            ) ? (
              <Button asChild variant="outline" size="sm">
                <Link
                  href={`/product-management/product-imports/${currentImport.uuid}/error-report`}
                  target="_blank"
                  rel="noopener"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download errors CSV
                </Link>
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {validatedRows.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Validation Review</CardTitle>
            <CardDescription>
              Full row feedback arrives before processing so you can correct the
              CSV and retry cleanly.
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
                          <div className="text-sm font-medium text-destructive">
                            Errors
                          </div>
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
                          <div className="text-sm font-medium text-foreground">
                            Suggestions
                          </div>
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
              Processing is idempotent at the import boundary. Re-running a
              finished import replays the persisted result instead of creating
              duplicate products.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground">Processed</div>
                <div className="mt-2 text-2xl font-semibold">
                  {processResult.processed_rows}
                </div>
              </div>
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground">Succeeded</div>
                <div className="mt-2 text-2xl font-semibold">
                  {processResult.succeeded_rows}
                </div>
              </div>
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground">Failed</div>
                <div className="mt-2 text-2xl font-semibold">
                  {processResult.failed_rows}
                </div>
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
                      <div className="mt-1">
                        Rows: {failure.row_numbers.join(", ")}
                      </div>
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
