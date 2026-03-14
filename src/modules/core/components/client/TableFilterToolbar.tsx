"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterDefinition = {
  key: string;
  label: string;
  options: FilterOption[];
};

interface TableFilterToolbarProps {
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  onSearchSubmit: () => void;
  filters: Record<string, string>;
  filterDefinitions: FilterDefinition[];
  onFilterChange: (key: string, value: string) => void;
  onFilterClear: (key: string) => void;
}

export default function TableFilterToolbar({
  searchValue,
  onSearchValueChange,
  onSearchSubmit,
  filters,
  filterDefinitions,
  onFilterChange,
  onFilterClear,
}: TableFilterToolbarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Input
            value={searchValue}
            onChange={(event) => onSearchValueChange(event.target.value)}
            placeholder="Search by name, email, or phone..."
            className="max-w-xs"
          />
          <Button onClick={onSearchSubmit}>Search</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {filterDefinitions.map((filterDefinition) => (
            <div
              key={filterDefinition.key}
              className="flex items-center gap-2"
            >
              <Select
                value={filters[filterDefinition.key] ?? "__all__"}
                onValueChange={(value) =>
                  onFilterChange(
                    filterDefinition.key,
                    value === "__all__" ? "" : value,
                  )
                }
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue
                    placeholder={`Filter by ${filterDefinition.label}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">
                    All {filterDefinition.label}
                  </SelectItem>
                  {filterDefinition.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => onFilterClear(filterDefinition.key)}
              >
                Clear
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
