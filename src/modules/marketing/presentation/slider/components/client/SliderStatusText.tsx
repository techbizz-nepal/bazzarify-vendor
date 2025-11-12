"use client";

import { TSlider } from "@/modules/marketing/domain/slider/schemas/Slider";
import useSliderStatus from "@/modules/marketing/presentation/slider/hooks/useSliderStatus";

interface Props {
  value: string;
  slider: TSlider;
}
export default function SliderStatusText({ value, slider }: Props) {
  const { isPending, optimisticStatus } = useSliderStatus({ slider });
  console.log("on SliderStatusText: ", {
    slider: slider.title,
    isPending,
    optimisticStatus,
  });
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        value === "active"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {isPending ? <p>Updating Status...</p> : optimisticStatus}
    </span>
  );
}
