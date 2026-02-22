"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DynamicTable from "@/modules/core/components/client/DynamicTable";
import { sliderIndexColumns } from "@/modules/marketing/domain/slider/consts/SliderIndexColumns";
import useSliderIndexPage from "@/modules/marketing/presentation/slider/hooks/useSliderIndexPage";

interface Props {
  sliderResponse: ReturnType<typeof useSliderIndexPage>["sliderResponse"];
  isPending: ReturnType<typeof useSliderIndexPage>["isPending"];
  handlePrevPage: ReturnType<typeof useSliderIndexPage>["handlePrevPage"];
  handleNextPage: ReturnType<typeof useSliderIndexPage>["handleNextPage"];
}

export default function List({
  sliderResponse,
  isPending,
  handlePrevPage,
  handleNextPage,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Sliders</CardTitle>
        <CardDescription>
          {sliderResponse
            ? `Showing ${sliderResponse?.from}-${sliderResponse.to} of sliders`
            : "No sliders loaded yet. Use the filter above to load sliders."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="flex flex-col items-center space-y-4">
            {Array.from({ length: 15 }).map((_, index) => (
              <Skeleton
                key={`slider-skeleton-${index}`}
                className="h-4 w-full "
              />
            ))}
          </div>
        ) : (
          <DynamicTable
            columns={sliderIndexColumns}
            data={sliderResponse?.data || []}
            loading={isPending}
            emptyMessage="No sliders found. Try adjusting your filters."
          />
        )}
      </CardContent>
      <CardFooter>
        <div className="flex flex-row items-center justify-between space-x-4">
          <Button
            onClick={handlePrevPage}
            variant="default"
            disabled={isPending || !sliderResponse?.prev_page_url}
          >
            Previous
          </Button>
          <Button
            onClick={handleNextPage}
            variant="default"
            disabled={isPending || !sliderResponse?.next_page_url}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
