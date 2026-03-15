"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DynamicTable, {
  TableColumn,
} from "@/modules/core/components/client/DynamicTable";
import TableFilterToolbar, {
  FilterDefinition,
} from "@/modules/core/components/client/TableFilterToolbar";
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
}: ServerDataTableProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [searchDraft, setSearchDraft] = useState(initialFilters[search.queryKey] ?? "");
  const [activeFilters, setActiveFilters] =
    useState<Record<string, string>>(initialFilters);

  const paginationSummary = useMemo(() => {
    if (pagination.from == null || pagination.to == null) {
      return "No records available.";
    }

    return `Showing ${pagination.from}-${pagination.to}`;
  }, [pagination.from, pagination.to]);

  const navigateWithFilters = (nextFilters: Record<string, string>) => {
    const searchParams = buildNextSearchParams(nextFilters, search.queryKey);
    searchParams.delete("page");

    const query = searchParams.toString();

    startTransition(() => {
      router.push(query.length > 0 ? `${pathname}?${query}` : pathname);
    });
  };

  const navigateToPage = (nextPage: number) => {
    const searchParams = buildNextSearchParams(activeFilters, search.queryKey);
    searchParams.set("page", String(nextPage));

    startTransition(() => {
      router.push(`${pathname}?${searchParams.toString()}`);
    });
  };

  const handleSearchSubmit = () => {
    const nextFilters = {
      ...activeFilters,
      [search.queryKey]: searchDraft.trim(),
    };
    setActiveFilters(nextFilters);
    navigateWithFilters(nextFilters);
  };

  const handleFilterChange = (key: string, value: string) => {
    const nextFilters = {
      ...activeFilters,
      [key]: value,
    };
    setActiveFilters(nextFilters);
    navigateWithFilters(nextFilters);
  };

  const handleFilterClear = (key: string) => {
    const nextFilters = { ...activeFilters };
    delete nextFilters[key];

    if (key === search.queryKey) {
      setSearchDraft("");
    }

    setActiveFilters(nextFilters);
    navigateWithFilters(nextFilters);
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
          {toolbarAction}
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        <TableFilterToolbar
          searchValue={searchDraft}
          searchPlaceholder={search.placeholder}
          onSearchValueChange={setSearchDraft}
          onSearchSubmit={handleSearchSubmit}
          filters={activeFilters}
          filterDefinitions={filters}
          onFilterChange={handleFilterChange}
          onFilterClear={handleFilterClear}
          isPending={isPending}
        />
        <DynamicTable
          columns={columns}
          data={rows}
          loading={isPending}
          emptyMessage={emptyMessage}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">{paginationSummary}</p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigateToPage(pagination.currentPage - 1)}
              disabled={isPending || !pagination.hasPreviousPage}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {pagination.currentPage}
            </span>
            <Button
              variant="outline"
              onClick={() => navigateToPage(pagination.currentPage + 1)}
              disabled={isPending || !pagination.hasNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
