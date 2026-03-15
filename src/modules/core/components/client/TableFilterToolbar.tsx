"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DateRangeFilter from "@/modules/core/components/client/DateRangeFilter";
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

export type FilterDefinition =
  | {
      type?: "select" | "text";
      key: string;
      label: string;
      placeholder?: string;
      options?: FilterOption[];
    }
  | {
      type: "date-range";
      key: string;
      label: string;
      fromKey: string;
      toKey: string;
      maxMonths?: number;
    };

interface TableFilterToolbarProps {
  searchValue: string;
  searchPlaceholder?: string;
  onSearchValueChange: (value: string) => void;
  onSearchSubmit: () => void;
  filters: Record<string, string>;
  filterDefinitions: FilterDefinition[];
  onFilterChange: (key: string, value: string) => void;
  onFilterClear: (key: string) => void;
  isPending?: boolean;
  submitLabel?: string;
}

export default function TableFilterToolbar({
  searchValue,
  searchPlaceholder = "Search by name, email, or phone...",
  onSearchValueChange,
  onSearchSubmit,
  filters,
  filterDefinitions,
  onFilterChange,
  onFilterClear,
  isPending = false,
  submitLabel = "Apply Filters",
}: TableFilterToolbarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Input
            value={searchValue}
            onChange={(event) => onSearchValueChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="max-w-xs"
          />
          <Button onClick={onSearchSubmit} disabled={isPending}>
            {isPending ? "Loading..." : submitLabel}
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {filterDefinitions.map((filterDefinition) => (
            <div
              key={filterDefinition.key}
              className="flex items-center gap-2"
            >
              {filterDefinition.type === "date-range" ? (
                <DateRangeFilter
                  label={filterDefinition.label}
                  fromValue={filters[filterDefinition.fromKey] ?? ""}
                  toValue={filters[filterDefinition.toKey] ?? ""}
                  onChange={({ from, to }) => {
                    onFilterChange(filterDefinition.fromKey, from);
                    onFilterChange(filterDefinition.toKey, to);
                  }}
                  maxMonths={filterDefinition.maxMonths}
                  disabled={isPending}
                />
              ) : filterDefinition.type === "text" ? (
                <Input
                  value={filters[filterDefinition.key] ?? ""}
                  onChange={(event) =>
                    onFilterChange(filterDefinition.key, event.target.value)
                  }
                  placeholder={
                    filterDefinition.placeholder ??
                    `Filter by ${filterDefinition.label}`
                  }
                  className="w-[220px]"
                />
              ) : (
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
                      placeholder={
                        filterDefinition.placeholder ??
                        `Filter by ${filterDefinition.label}`
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">
                      All {filterDefinition.label}
                    </SelectItem>
                    {(filterDefinition.options ?? []).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  if (filterDefinition.type === "date-range") {
                    onFilterClear(filterDefinition.fromKey);
                    onFilterClear(filterDefinition.toKey);
                    return;
                  }

                  onFilterClear(filterDefinition.key);
                }}
                disabled={isPending}
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
