import { Button } from "@/components/ui/button";
import { TableColumn } from "@/modules/core/components/client/DynamicTable";
import { TSliderWithImages } from "@/modules/marketing/domain/slider/schemas/Slider";
import SliderStatusTextWithUpdateAction from "@/modules/marketing/presentation/slider/components/client/SliderStatusText";
import Link from "next/link";

export const sliderIndexColumns: TableColumn<TSliderWithImages>[] = [
  {
    key: "title",
    title: "Title",
    width: "40%",
    render: (value: string) => value || "-",
  },
  {
    key: "status",
    title: "Status",
    width: "10%",
    render: (_value: string, record: TSliderWithImages) => (
      <SliderStatusTextWithUpdateAction key={record.uuid} slider={record} />
    ),
  },
  {
    key: "owner.name",
    title: "Owner",
    width: "30%",
    render: (value: string, record: TSliderWithImages) => {
      return record.owner?.name || record.owner?.email || "-";
    },
  },
  {
    key: "created_at",
    title: "Created At",
    width: "10%",
    render: (value: string) => {
      if (!value) return "-";
      return new Date(value).toLocaleDateString();
    },
  },
  {
    key: "action",
    title: "Action",
    width: "10%",
    render: (_value: string, record: TSliderWithImages) => (
      <Link href={`/sliders/${record.uuid}/delete`}>
        <Button>Delete</Button>
      </Link>
    ),
  },
];
