"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TProductStoreFilterOption } from "@/modules/product.management";
import { actionGetProductStoreOptions } from "@/modules/product.management/actions/product";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

interface AsyncFilterSelectProps {
  filterKey: string;
  label: string;
  placeholder?: string;
  source: string;
  value: string;
  selectedOption?: {
    value: string;
    label: string;
  } | null;
  disabled?: boolean;
  onChange: (value: string) => void;
}

const EMPTY_OPTIONS: TProductStoreFilterOption[] = [];

export default function AsyncFilterSelect({
  filterKey,
  label,
  placeholder,
  source,
  value,
  selectedOption = null,
  disabled = false,
  onChange,
}: AsyncFilterSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] =
    useState<TProductStoreFilterOption[]>(EMPTY_OPTIONS);
  const [isPending, startTransition] = useTransition();
  const resolvedOption = value
    ? (options.find((option) => option.value === value) ?? selectedOption)
    : null;

  useEffect(() => {
    if (!open) {
      return;
    }

    const handle = window.setTimeout(() => {
      startTransition(() => {
        void loadOptions(source, search).then((result) => {
          if ("error" in result) {
            return;
          }

          setOptions(result.options);
        });
      });
    }, 200);

    return () => window.clearTimeout(handle);
  }, [open, search, source]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[260px] justify-between"
          disabled={disabled}
        >
          <span className="truncate">
            {resolvedOption?.label ??
              (value ? value : (placeholder ?? `Filter by ${label}`))}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder ?? `Search ${label.toLowerCase()}...`}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {isPending ? "Loading..." : `No ${label.toLowerCase()} found.`}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={`${filterKey}-${option.value}`}
                  value={option.value}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="truncate">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

async function loadOptions(
  source: string,
  search: string,
): Promise<
  | { options: TProductStoreFilterOption[] }
  | {
      error: string;
    }
> {
  switch (source) {
    case "product-store-options": {
      const result = await actionGetProductStoreOptions(search.trim());
      if ("options" in result) {
        return result;
      }

      return {
        error: result.error ?? "Unable to load store options.",
      };
    }
    default:
      return { error: `Unsupported async filter source: ${source}` };
  }
}
