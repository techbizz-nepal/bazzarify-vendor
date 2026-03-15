"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addMonths, format, isAfter, parseISO } from "date-fns";
import { CalendarDays } from "lucide-react";
import { useMemo } from "react";
import { DateRange } from "react-day-picker";

const DATE_FORMAT = "yyyy-MM-dd";

const parseDateValue = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  const parsedDate = parseISO(value);
  return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
};

const formatDateValue = (value: Date | undefined) => {
  return value ? format(value, DATE_FORMAT) : "";
};

interface DateRangeFilterProps {
  label: string;
  fromValue?: string;
  toValue?: string;
  onChange: (nextRange: { from: string; to: string }) => void;
  maxMonths?: number;
  disabled?: boolean;
}

export default function DateRangeFilter({
  label,
  fromValue,
  toValue,
  onChange,
  maxMonths = 1,
  disabled = false,
}: DateRangeFilterProps) {
  const selectedRange = useMemo<DateRange | undefined>(() => {
    const from = parseDateValue(fromValue);
    const to = parseDateValue(toValue);

    if (!from && !to) {
      return undefined;
    }

    return { from, to };
  }, [fromValue, toValue]);

  const buttonLabel = useMemo(() => {
    if (selectedRange?.from && selectedRange?.to) {
      return `${format(selectedRange.from, "MMM d, yyyy")} - ${format(selectedRange.to, "MMM d, yyyy")}`;
    }

    if (selectedRange?.from) {
      return `${format(selectedRange.from, "MMM d, yyyy")} - Select end date`;
    }

    return `Select ${label.toLowerCase()}`;
  }, [label, selectedRange]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !selectedRange?.from && "text-muted-foreground",
          )}
          disabled={disabled}
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          {buttonLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={selectedRange}
          numberOfMonths={1}
          onSelect={(range) => {
            const nextFrom = range?.from;
            const nextTo = range?.to;

            if (
              nextFrom &&
              nextTo &&
              isAfter(nextTo, addMonths(nextFrom, maxMonths))
            ) {
              return;
            }

            onChange({
              from: formatDateValue(nextFrom),
              to: formatDateValue(nextTo),
            });
          }}
          disabled={(date) => {
            if (!selectedRange?.from || selectedRange.to) {
              return false;
            }

            return isAfter(date, addMonths(selectedRange.from, maxMonths));
          }}
        />
        <div className="border-t px-3 py-2 text-xs text-muted-foreground">
          Choose a date range up to {maxMonths} month.
        </div>
      </PopoverContent>
    </Popover>
  );
}
