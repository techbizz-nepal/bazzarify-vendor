"use client";
import IndexFilterCard from "@/modules/marketing/presentation/slider/components/client/IndexFilterCard";
import List from "@/modules/marketing/presentation/slider/components/client/List";
import useSliderIndexPage from "@/modules/marketing/presentation/slider/hooks/useSliderIndexPage";

export default function IndexContent() {
  const {
    setQueryParams,
    queryParams,
    handleFilterSubmit,
    sliderResponse,
    isPending,
    handlePrevPage,
    handleNextPage,
  } = useSliderIndexPage();
  return (
    <div className="flex flex-col space-y-4">
      <IndexFilterCard
        setQueryParamsAction={setQueryParams}
        queryParams={queryParams}
        isPending={isPending}
        handleFilterSubmitAction={handleFilterSubmit}
      />
      <List
        isPending={isPending}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        sliderResponse={sliderResponse}
      />
    </div>
  );
}
