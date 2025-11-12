"use client";

import { Button } from "@/components/ui/button";
import { TSlider } from "@/modules/marketing/domain/slider/schemas/Slider";
import useSliderStatus from "@/modules/marketing/presentation/slider/hooks/useSliderStatus";

interface Props {
  value: string;
  slider: TSlider;
}
export default function SliderStatusButton({ value, slider }: Props) {
  const { handleOrderStatusChange } = useSliderStatus({ slider });
  return (
    <Button
      id={value}
      onClick={(e) => handleOrderStatusChange(e)}
      variant="outline"
    >
      {value}
    </Button>
  );
}
