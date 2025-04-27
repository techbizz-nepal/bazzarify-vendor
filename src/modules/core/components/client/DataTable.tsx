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
import { useDataTableController } from "@/modules/core/hooks/useDataTableController";

export default function DataTable({
  entityKey,
  columns,
  fetchAction,
  filterOptions = [],
}: DataTableProps) {
  const {
    data,
    search,
    page,
    meta,
    loading,
    activeFilter,
    openDialog,
    onSearchChange,
    onPageChange,
    onFilterChange,
    onView,
    onEdit,
    handleOpenDialog,
    handleSelectItem,
    handleConfirmDelete,
  } = useDataTableController({ entityKey, fetchAction });

  return (
    <Card className="p-4 shadow-md">
      <div className="flex justify-between mb-4 items-center gap-4">
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-xs"
        />
        {filterOptions.length > 0 && (
          <Select
            value={activeFilter}
            onValueChange={(value) => onFilterChange(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <div className="flex items-center gap-4">
          <div className="text-sm">Page {page}</div>
          <div className="flex gap-2">
            <Button
              onClick={() => onPageChange("prev")}
              disabled={loading || (meta ? !meta.prev_page_url : true)}
            >
              Previous
            </Button>
            <Button
              onClick={() => onPageChange("next")}
              disabled={loading || (meta ? !meta.next_page_url : true)}
            >
              Next
            </Button>
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
              <TableRow key={item.uuid}>
                {columns.map((col) => (
                  <TableCell key={col.accessor}>{item[col.accessor]}</TableCell>
                ))}
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
