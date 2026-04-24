"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SliderStatus } from "@/modules/marketing/domain/slider/enums/SliderStatus";
import { TSliderWithImages } from "@/modules/marketing/domain/slider/schemas/Slider";
import useSliderStatus from "@/modules/marketing/presentation/slider/hooks/useSliderStatus";

interface Props {
  slider: TSliderWithImages;
}
export default function SliderStatusText({ slider }: Props) {
  const { isPending, optimisticStatus, handleOrderStatusChange } =
    useSliderStatus({ slider });
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-2">
      <span
        className={cn(
          `px-2 py-1 rounded-full text-xs font-medium`,
          optimisticStatus === "active" && "bg-green-100 text-green-800",
          optimisticStatus === "inactive" && "bg-red-100 text-red-800",
        )}
      >
        {isPending ? <p>Updating...</p> : optimisticStatus}
      </span>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Update Status</Button>
        </PopoverTrigger>
        <PopoverContent className="w-32 flex flex-col space-y-3">
          {Object.values(SliderStatus).map((value) => (
            <Button
              key={value}
              id={value}
              onClick={handleOrderStatusChange}
              variant="outline"
            >
              {value}
            </Button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}
