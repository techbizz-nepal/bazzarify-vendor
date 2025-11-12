import { actionUpdateSliderStatus } from "@/modules/marketing/domain/slider/actions/actionUpdateSliderStatus";
import { TSlider } from "@/modules/marketing/domain/slider/schemas/Slider";
import { SyntheticEvent, useOptimistic, useState, useTransition } from "react";

export default function useSliderStatus({ slider }: { slider: TSlider }) {
  const [sliderStatus, setSliderStatus] = useState(slider.status);
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    sliderStatus,
    (currentState, optimisticValue) => optimisticValue as string,
  );

  const [isPending, startTransition] = useTransition();
  // console.log("on status hook: ", {
  //   slider: slider.title,
  //   sliderStatus,
  //   optimisticStatus,
  // });
  const handleOrderStatusChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    const updatedStatus = e.currentTarget.id;
    startTransition(async () => {
      setOptimisticStatus(updatedStatus);
      try {
        const result = await actionUpdateSliderStatus(
          slider.uuid,
          updatedStatus,
        );
        if (result?.error) {
          console.error("Error updating status:", result.error);
        } else {
          console.log(result.status);
          setSliderStatus(result.status);
        }
      } catch (error) {
        console.error(
          "Mock server error (should not happen in this version):",
          error,
        );
      }
    });
  };
  return {
    optimisticStatus,
    isPending,
    handleOrderStatusChange,
  };
}
