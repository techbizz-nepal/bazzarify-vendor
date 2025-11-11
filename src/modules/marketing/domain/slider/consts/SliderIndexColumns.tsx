import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TableColumn } from "@/modules/core/components/client/DynamicTable";
import { SliderStatus } from "@/modules/marketing/domain/slider/enums/SliderStatus";
import { TSlider } from "@/modules/marketing/domain/slider/schemas/Slider";
import Link from "next/link";

export const sliderIndexColumns: TableColumn<TSlider>[] = [
  {
    key: "title",
    title: "Title",
    width: "250px",
    render: (value: string) => value || "-",
  },
  {
    key: "status",
    title: "Status",
    width: "100px",
    render: (value: string) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === "active"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {value}
      </span>
    ),
  },
  {
    key: "owner.name",
    title: "Owner",
    width: "150px",
    render: (value: string, record: TSlider) => {
      return record.owner?.name || record.owner?.email || "-";
    },
  },
  {
    key: "created_at",
    title: "Created At",
    width: "150px",
    render: (value: string) => {
      if (!value) return "-";
      return new Date(value).toLocaleDateString();
    },
  },
  {
    key: "action",
    title: "Action",
    width: "100px",
    render: (_value: string, record: TSlider) => (
      <div className="flex-row space-x-4 flex">
        <Link href={`/sliders/${encodeURIComponent(record.uuid)}/edit`}>
          <Button variant="default">Edit</Button>
        </Link>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Update Status</Button>
          </PopoverTrigger>
          <PopoverContent className="w-32 flex flex-col space-y-3">
            {Object.entries(SliderStatus).map(([key, value]) => (
              <Button key={key} variant="outline">
                {value}
              </Button>
            ))}
          </PopoverContent>
        </Popover>
      </div>
    ),
  },
];
