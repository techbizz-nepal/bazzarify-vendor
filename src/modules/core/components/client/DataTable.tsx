"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableProps } from "@/modules/core";
import { ConfirmDialog } from "@/modules/core/components/client/ConfirmDialog";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";
import { useDataTableController } from "@/modules/core/hooks/useDataTableController";

export default function DataTable<T>({
  entityKey,
  columns,
  fetchAction,
  filterOptions = [],
}: DataTableProps<T>) {
  const {
    data,
    page,
    meta,
    loading,
    openDialog,
    filters,
    searchInputRef,
    onSearchChange,
    onPageChange,
    onFilterChange,
    onView,
    onEdit,
    handleOpenDialog,
    handleSelectItem,
    handleConfirmDelete,
    getNestedValue,
    onFilterClear,
  } = useDataTableController({ entityKey, fetchAction });
  return (
    <Card className="p-4 shadow-md">
      <div className="flex flex-col md:flex-row  justify-between mb-4 items-center gap-4">
        <div className="flex-col space-y-7 items-center">
          <div className="flex items-center space-x-2">
            <Input
              ref={searchInputRef}
              placeholder="Search by name..."
              className="max-w-xs"
            />
            <ThemedButton onClick={onSearchChange}>Search</ThemedButton>
          </div>
          <div className="flex items-center space-x-2">
            {filterOptions.map((option) => (
              <div key={option.key} className="flex  items-center space-x-2">
                <Select
                  key={option.key}
                  value={filters[option.key] || ""}
                  onValueChange={(value) => onFilterChange(option.key, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={`Filter by ${option.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={option.value}>{option.label}</SelectItem>
                  </SelectContent>
                </Select>
                <ThemedButton onClick={() => onFilterClear(option.key)}>
                  Clear
                </ThemedButton>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm">Page {page}</div>
          <div className="flex gap-2">
            <ThemedButton
              onClick={() => onPageChange("prev")}
              disabled={loading || (meta ? !meta.prev_page_url : true)}
            >
              Previous
            </ThemedButton>
            <ThemedButton
              onClick={() => onPageChange("next")}
              disabled={loading || (meta ? !meta.next_page_url : true)}
            >
              Next
            </ThemedButton>
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.accessor}>{col.label}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item) => (
              <TableRow key={item?.uuid}>
                {columns.map((col) => {
                  const cellData = getNestedValue(item, col.accessor);
                  return (
                    <TableCell className="truncate" key={col.accessor}>
                      {cellData.length <= 25
                        ? cellData
                        : cellData.slice(0, 25).concat("...")}
                    </TableCell>
                  );
                })}
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(item)}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        handleSelectItem(item);
                        handleOpenDialog();
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="text-center">
                No records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ConfirmDialog
        open={openDialog}
        title="Are you sure you want to delete?"
        onCancel={handleOpenDialog}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  );
}
