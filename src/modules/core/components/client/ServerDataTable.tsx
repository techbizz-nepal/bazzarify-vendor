"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DynamicTable, {
  TableColumn,
} from "@/modules/core/components/client/DynamicTable";
import TableFilterToolbar, {
  FilterDefinition,
} from "@/modules/core/components/client/TableFilterToolbar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useMemo, useState, useTransition } from "react";

export interface ServerDataTablePagination {
  currentPage: number;
  perPage?: number | null;
  from?: number | string | null;
  to?: number | string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ServerDataTableSearch {
  queryKey: string;
  value: string;
  placeholder: string;
}

interface ServerDataTableProps<T> {
  title?: string;
  description?: string;
  toolbarAction?: ReactNode;
  columns: TableColumn<T>[];
  rows: T[];
  emptyMessage: string;
  search: ServerDataTableSearch;
  filters?: FilterDefinition[];
  initialFilters: Record<string, string>;
  pagination: ServerDataTablePagination;
  rowActions?: Array<{
    label: string;
    hrefTemplate: string;
    variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  }>;
}

interface PaginationControlsProps {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isPending: boolean;
  onNavigateToPage: (nextPage: number) => void;
}

function PaginationControls({
  currentPage,
  hasNextPage,
  hasPreviousPage,
  isPending,
  onNavigateToPage,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={() => onNavigateToPage(currentPage - 1)}
        disabled={isPending || !hasPreviousPage}
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">Page {currentPage}</span>
      <Button
        variant="outline"
        onClick={() => onNavigateToPage(currentPage + 1)}
        disabled={isPending || !hasNextPage}
      >
        Next
      </Button>
    </div>
  );
}

const buildNextSearchParams = (
  currentFilters: Record<string, string>,
  searchKey: string,
) => {
  const searchParams = new URLSearchParams();

  Object.entries(currentFilters).forEach(([key, value]) => {
    if (!value) {
      return;
    }

    searchParams.set(key, value);
  });

  if (searchParams.get(searchKey)?.trim() === "") {
    searchParams.delete(searchKey);
  }

  return searchParams;
};

const resolveRowActionHref = <T,>(record: T, hrefTemplate: string) => {
  return hrefTemplate.replace(/:([A-Za-z0-9_]+)/g, (_, key: string) => {
    const value =
      record &&
      typeof record === "object" &&
      key in (record as Record<string, unknown>)
        ? (record as Record<string, unknown>)[key]
        : "";

    return typeof value === "string" || typeof value === "number"
      ? String(value)
      : "";
  });
};

export default function ServerDataTable<T>({
  title,
  description,
  toolbarAction,
  columns,
  rows,
  emptyMessage,
  search,
  filters = [],
  initialFilters,
  pagination,
  rowActions = [],
}: ServerDataTableProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [draftFilters, setDraftFilters] = useState<Record<string, string>>(
    initialFilters,
  );

  const paginationSummary = useMemo(() => {
    if (pagination.from == null || pagination.to == null) {
      return "No records available.";
    }

    return `Showing ${pagination.from}-${pagination.to}`;
  }, [pagination.from, pagination.to]);

  const columnsWithActions = useMemo(() => {
    if (rowActions.length === 0) {
      return columns;
    }

    const actionColumn: TableColumn<T> = {
      key: "__actions",
      title: "Actions",
      align: "right",
      render: (_, record) => (
        <div className="flex justify-end gap-2">
          {rowActions.map((action) => (
            <Button
              key={`${action.label}-${action.hrefTemplate}`}
              asChild
              size="sm"
              variant={action.variant ?? "outline"}
            >
              <Link href={resolveRowActionHref(record, action.hrefTemplate)}>
                {action.label}
              </Link>
            </Button>
          ))}
        </div>
      ),
    };

    return [...columns, actionColumn];
  }, [columns, rowActions]);

  const appliedFilters = initialFilters;

  const navigateWithFilters = (nextFilters: Record<string, string>) => {
    const searchParams = buildNextSearchParams(nextFilters, search.queryKey);
    searchParams.delete("page");

    const query = searchParams.toString();

    startTransition(() => {
      router.push(query.length > 0 ? `${pathname}?${query}` : pathname);
    });
  };

  const navigateToPage = (nextPage: number) => {
    const searchParams = buildNextSearchParams(appliedFilters, search.queryKey);
    searchParams.set("page", String(nextPage));

    startTransition(() => {
      router.push(`${pathname}?${searchParams.toString()}`);
    });
  };

  const handleSearchValueChange = (value: string) => {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      [search.queryKey]: value,
    }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  };

  const handleFilterSubmit = () => {
    const nextFilters = Object.fromEntries(
      Object.entries(draftFilters).map(([key, value]) => [
        key,
        key === search.queryKey ? value.trim() : value,
      ]),
    );

    setDraftFilters(nextFilters);
    navigateWithFilters(nextFilters);
  };

  const handleFilterClear = (key: string) => {
    const nextFilters = { ...draftFilters };
    delete nextFilters[key];
    setDraftFilters(nextFilters);
  };

  return (
    <Card className="shadow-md">
      {(title || description || toolbarAction) && (
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            {title && <CardTitle className="text-2xl">{title}</CardTitle>}
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            {toolbarAction}
            <PaginationControls
              currentPage={pagination.currentPage}
              hasNextPage={pagination.hasNextPage}
              hasPreviousPage={pagination.hasPreviousPage}
              isPending={isPending}
              onNavigateToPage={navigateToPage}
            />
          </div>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        <TableFilterToolbar
          searchValue={draftFilters[search.queryKey] ?? ""}
          searchPlaceholder={search.placeholder}
          onSearchValueChange={handleSearchValueChange}
          onSearchSubmit={handleFilterSubmit}
          filters={draftFilters}
          filterDefinitions={filters}
          onFilterChange={handleFilterChange}
          onFilterClear={handleFilterClear}
          isPending={isPending}
          submitLabel="Apply Filters"
        />
        <DynamicTable
          columns={columnsWithActions}
          data={rows}
          loading={isPending}
          emptyMessage={emptyMessage}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">{paginationSummary}</p>
          <PaginationControls
            currentPage={pagination.currentPage}
            hasNextPage={pagination.hasNextPage}
            hasPreviousPage={pagination.hasPreviousPage}
            isPending={isPending}
            onNavigateToPage={navigateToPage}
          />
        </div>
      </CardContent>
    </Card>
  );
}
