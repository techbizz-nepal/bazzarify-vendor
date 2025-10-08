"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode } from "react";

export interface TableColumn<T = any> {
  key: string;
  title: string;
  render?: (value: any, record: T, index: number) => ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface DynamicTableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export default function DynamicTable<T = any>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available",
  className,
}: DynamicTableProps<T>) {
  const renderCellValue = (
    column: TableColumn<T>,
    record: T,
    index: number,
  ) => {
    const value = getNestedValue(record, column.key);

    if (column.render) {
      return column.render(value, record, index);
    }

    return value ?? "-";
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.key}
              style={{ width: column.width }}
              className={
                column.align === "center"
                  ? "text-center"
                  : column.align === "right"
                    ? "text-right"
                    : "text-left"
              }
            >
              {column.title}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
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
                  className={
                    column.align === "center"
                      ? "text-center"
                      : column.align === "right"
                        ? "text-right"
                        : "text-left"
                  }
                >
                  {renderCellValue(column, record, index)}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
