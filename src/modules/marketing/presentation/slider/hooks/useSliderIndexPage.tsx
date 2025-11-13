"use client";

import { TQueryParams } from "@/modules/core/domain/schemas/QueryParams";
import appendQueryParams from "@/modules/core/utils/dynamicTable/appendQueryParams";
import { actionGetSliders } from "@/modules/marketing/domain/slider/actions/actionGetSliders";
import { TSliderWithImagesResponse } from "@/modules/marketing/domain/slider/schemas/SliderIndexResponsePayload";
import { useEffect, useState, useTransition } from "react";

export default function useSliderIndexPage() {
  const [sliderResponse, setSliderResponse] =
    useState<TSliderWithImagesResponse | null>(null);
  const [isPending, startTransition] = useTransition();
  const [queryParams, setQueryParams] = useState<TQueryParams>({
    filters: {
      status: "null",
      from: "null",
      to: "null",
    },
    page: 1,
  });

  useEffect(() => {
    submitToApi(appendQueryParams(new FormData(), queryParams)).then(
      () => undefined,
    );
  }, [queryParams]);
  const handleFilterSubmit = async () => {
    await submitToApi(appendQueryParams(new FormData(), queryParams));
  };
  const handleNextPage = async () => {
    const updateParams = {
      ...queryParams,
      page: queryParams.page + 1,
    };
    setQueryParams(updateParams);
  };
  const handlePrevPage = async () => {
    const updateParams = {
      ...queryParams,
      page: queryParams.page - 1,
    };
    setQueryParams(updateParams);
  };
  async function submitToApi(formData: FormData) {
    startTransition(async () => {
      try {
        const result = await actionGetSliders(formData);
        if (result.error) {
          console.error("Error fetching orders:", result.error);
        } else {
          setSliderResponse(result.sliders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    });
  }
  return {
    sliderResponse,
    isPending,
    handleFilterSubmit,
    setQueryParams,
    queryParams,
    handleNextPage,
    handlePrevPage,
  };
}
