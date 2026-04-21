"use client";

import { Button } from "@/components/ui/button";
import ServerDataTable from "@/modules/core/components/client/ServerDataTable";
import { TableColumn } from "@/modules/core/components/client/DynamicTable";
import type { TServerDataTableMeta } from "@/modules/core/domain/schemas/ServerDataTableMeta";
import { TProductImportRecord } from "@/modules/product.management";
import { actionCancelProductImport } from "@/modules/product.management/actions/import";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

const CANCELLABLE_STATUSES = new Set([
  "uploaded",
  "validating",
  "validation_failed",
  "ready",
  "processing",
]);

const DOWNLOADABLE_ERROR_STATUSES = new Set([
  "validation_failed",
  "completed_with_errors",
  "failed",
]);

interface ProductImportsServerTableProps {
  rows: TProductImportRecord[];
  table: TServerDataTableMeta;
  initialFilters: Record<string, string>;
  pagination: {
    currentPage: number;
    perPage?: number | null;
    from?: number | string | null;
    to?: number | string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  canManageAcrossStores: boolean;
}

export default function ProductImportsServerTable({
  rows,
  table,
  initialFilters,
  pagination,
  canManageAcrossStores,
}: ProductImportsServerTableProps) {
  const router = useRouter();
  const [isCancelling, startCancel] = useTransition();

  const columns: TableColumn<TProductImportRecord>[] = [
    {
      key: "source_filename",
      title: "File",
      render: (value, record) =>
        typeof value === "string" && value.length > 0 ? value : record.uuid,
    },
    {
      key: "status",
      title: "Status",
      render: (value) =>
        typeof value === "string"
          ? value.replace(/_/g, " ").toUpperCase()
          : "—",
    },
    {
      key: "total_rows",
      title: "Rows",
      align: "right",
    },
    {
      key: "progress_percentage",
      title: "Progress",
      align: "right",
      render: (value) => (typeof value === "number" ? `${Math.round(value)}%` : "—"),
    },
    {
      key: "created_at",
      title: "Created",
      render: (value) =>
        typeof value === "string" && value.length > 0
          ? new Date(value).toLocaleString()
          : "—",
    },
  ];

  if (canManageAcrossStores) {
    columns.splice(1, 0, {
      key: "target_store",
      title: "Store",
      render: (_, record) => record.target_store?.name ?? record.target_store_uuid ?? "—",
    });
  }

  columns.push({
    key: "import_actions",
    title: "Actions",
    align: "right",
    render: (_, record) => {
      const canCancel =
        record.status !== null && CANCELLABLE_STATUSES.has(record.status);
      const canDownloadErrors =
        record.status !== null && DOWNLOADABLE_ERROR_STATUSES.has(record.status);

      return (
        <div className="flex flex-wrap justify-end gap-2">
          <Button asChild size="sm">
            <Link href={`/products/imports/${record.uuid}`}>View</Link>
          </Button>
          {canDownloadErrors ? (
            <Button asChild size="sm" variant="outline">
              <Link
                href={`/product-management/product-imports/${record.uuid}/error-report`}
                target="_blank"
                rel="noopener"
              >
                Download errors
              </Link>
            </Button>
          ) : null}
          {canCancel ? (
            <Button
              size="sm"
              variant="destructive"
              disabled={isCancelling}
              onClick={() => {
                if (!window.confirm("Cancel this import?")) return;
                startCancel(async () => {
                  const result = await actionCancelProductImport(record.uuid);
                  if (result && typeof result === "object" && "import" in result) {
                    toast.success("Import cancelled.");
                    router.refresh();
                    return;
                  }
                  if (result && typeof result === "object" && "summary" in result) {
                    toast.error(result.summary);
                    return;
                  }
                  toast.error(result.error);
                });
              }}
            >
              Cancel
            </Button>
          ) : null}
        </div>
      );
    },
  });

  return (
    <ServerDataTable
      title={canManageAcrossStores ? "All Product Imports" : "Product Imports"}
      description={
        canManageAcrossStores
          ? "Manage product imports across every tenant store."
          : "Review your store's bulk product imports. Cancel stuck jobs and download row-level error reports."
      }
      toolbarAction={
        <Button asChild>
          <Link href="/products/imports/new">New import</Link>
        </Button>
      }
      columns={columns}
      rows={rows}
      emptyMessage="No product imports yet."
      table={table}
      initialFilters={initialFilters}
      pagination={pagination}
    />
  );
}
