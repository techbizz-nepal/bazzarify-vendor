"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode } from "react";

type BivariantCallback<Args extends unknown[], Return> = {
  bivarianceHack(...args: Args): Return;
}["bivarianceHack"];

export interface TableColumn<T = unknown> {
  key: string;
  title: string;
  render?: BivariantCallback<
    [value: unknown, record: T, index: number],
    ReactNode
  >;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface DynamicTableProps<T = unknown> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  skeletonRowCount?: number;
}

export default function DynamicTable<T = unknown>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available",
  className,
  skeletonRowCount = 8,
}: DynamicTableProps<T>) {
  const renderCellValue = (
    column: TableColumn<T>,
    record: T,
    index: number,
  ): ReactNode => {
    const value = getNestedValue(record, column.key);

    if (column.render) {
      return column.render(value, record, index);
    }

    return normalizeCellValue(value);
  };

  const getNestedValue = (obj: unknown, path: string): unknown => {
    return path.split(".").reduce((current, key) => {
      if (
        current &&
        typeof current === "object" &&
        key in (current as Record<string, unknown>)
      ) {
        return (current as Record<string, unknown>)[key];
      }
      return null;
    }, obj);
  };

  const normalizeCellValue = (value: unknown): ReactNode => {
    if (value === null || value === undefined) {
      return "-";
    }
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return value;
    }
    return JSON.stringify(value);
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table className={className}>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                style={{ width: column.width }}
                className={[
                  "whitespace-nowrap",
                  column.align === "center"
                    ? "text-center"
                    : column.align === "right"
                      ? "text-right"
                      : "text-left",
                ].join(" ")}
              >
                {column.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
              <TableRow key={`skeleton-row-${rowIndex}`}>
                {columns.map((column) => (
                  <TableCell
                    key={`${column.key}-skeleton-${rowIndex}`}
                    className="align-top"
                  >
                    <Skeleton className="h-4 min-w-24 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-8 text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((record, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={[
                      "whitespace-nowrap align-top",
                      column.align === "center"
                        ? "text-center"
                        : column.align === "right"
                          ? "text-right"
                          : "text-left",
                    ].join(" ")}
                  >
                    {renderCellValue(column, record, index)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
