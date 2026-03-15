import PageContainer from "@/modules/core/components/server/PageContainer";
import { flattenSearchParams } from "@/modules/core/utils/searchParams";
import { actionGetSliders } from "@/modules/marketing/domain/slider/actions/actionGetSliders";
import SlidersServerTable from "@/modules/marketing/presentation/slider/components/client/SlidersServerTable";

export default async function SlidersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const flattenedParams = flattenSearchParams(resolvedSearchParams);
  const page = Number(flattenedParams.page ?? "1");

  const sliderResponse = await actionGetSliders({
    ...flattenedParams,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  });

  const sliders =
    sliderResponse &&
    typeof sliderResponse === "object" &&
    "sliders" in sliderResponse
      ? sliderResponse.sliders
      : null;

  const table =
    sliderResponse &&
    typeof sliderResponse === "object" &&
    "table" in sliderResponse
      ? sliderResponse.table
      : null;

  return (
    <PageContainer pageTitle="Manage Sliders">
      <SlidersServerTable
        rows={sliders?.data ?? []}
        table={
          table ?? {
            search: {
              queryKey: "filter[title]",
              placeholder: "Search sliders by title...",
            },
            filters: [],
          }
        }
        initialFilters={Object.fromEntries(
          Object.entries(flattenedParams).filter(([key]) => key !== "page"),
        )}
        pagination={{
          currentPage: Number(sliders?.current_page ?? 1),
          perPage: sliders?.per_page ? Number(sliders.per_page) : null,
          from: sliders?.from ?? null,
          to: sliders?.to ?? null,
          hasNextPage: Boolean(sliders?.next_page_url),
          hasPreviousPage: Boolean(sliders?.prev_page_url),
        }}
      />
    </PageContainer>
  );
}
