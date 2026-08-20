"use client";

import { Button } from "@/components/ui/button";
import ServerDataTable from "@/modules/core/components/client/ServerDataTable";
import { TServerDataTableMeta } from "@/modules/core/domain/schemas/ServerDataTableMeta";
import { sliderIndexColumns } from "@/modules/marketing/domain/slider/consts/SliderIndexColumns";
import { TSliderWithImages } from "@/modules/marketing/domain/slider/schemas/Slider";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

interface SlidersServerTableProps {
  rows: TSliderWithImages[];
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
}

export default function SlidersServerTable({
  rows,
  table,
  initialFilters,
  pagination,
}: SlidersServerTableProps) {
  return (
    <ServerDataTable
      title="Manage Sliders"
      description="Manage sliders with server-driven filters, pagination, and backend-owned query behavior."
      toolbarAction={
        <Button asChild size="sm">
          <Link href="/sliders/create">
            <FaPlus className="mr-2" />
            New Slider
          </Link>
        </Button>
      }
      columns={sliderIndexColumns}
      rows={rows}
      emptyMessage="No sliders found for the current filters."
      table={table}
      initialFilters={initialFilters}
      pagination={pagination}
    />
  );
}
