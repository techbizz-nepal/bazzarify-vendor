import { Button } from "@/components/ui/button";
import ServerDataTable from "@/modules/core/components/client/ServerDataTable";
import { TableColumn } from "@/modules/core/components/client/DynamicTable";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { flattenSearchParams } from "@/modules/core/utils/searchParams";
import { actionGetSliders } from "@/modules/marketing/domain/slider/actions/actionGetSliders";
import { sliderIndexColumns } from "@/modules/marketing/domain/slider/consts/SliderIndexColumns";
import { TSliderWithImages } from "@/modules/marketing/domain/slider/schemas/Slider";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

const columns = sliderIndexColumns as TableColumn<TSliderWithImages>[];

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
      <ServerDataTable
        title="Manage Sliders"
        description="Manage sliders with server-driven filters, pagination, and backend-owned query behavior."
        toolbarAction={
          <Button asChild size="sm">
            <Link href="/sliders/create">
              <FaPlus className="mr-2" />
              New Slider
            </Link>
          </Button>
        }
        columns={columns}
        rows={sliders?.data ?? []}
        emptyMessage="No sliders found for the current filters."
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
