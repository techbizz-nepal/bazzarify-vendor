import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/drop-down";
import { cn } from "@/lib/utils";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { TCategory } from "@/modules/product.management";

interface ICategoryDropdown {
  open: boolean;
  onOpenChangeAction: () => void;
  rootCategories: TCategory[];
  subCategories: TCategory[];
  subChildCategories: TCategory[];
  onClickRoot: (category: TCategory) => void;
  onClickSub: (category: TCategory) => void;
  onClickSubChild: (category: TCategory) => void;
  onFilterChange: (level: "root" | "sub" | "subchild", value: string) => void;
  selectedCategories: TCategory[] | [];
}

export default function CategoryDropdown({
  open,
  onOpenChangeAction,
  rootCategories,
  subCategories,
  subChildCategories,
  onClickRoot,
  onClickSub,
  onClickSubChild,
  onFilterChange,
  selectedCategories,
}: ICategoryDropdown) {
  const renderColumn = (
    _label: string,
    categories: TCategory[],
    onClick: (category: TCategory) => void,
    filterKey: "root" | "sub" | "subchild",
    selectedCategory: TCategory | { uuid: string },
  ) => (
    <div className="flex-col space-y-3 overflow-y-scroll h-96 px-2">
      <div className="pr-2">
        <Input
          placeholder="Filter"
          onChange={(e) => onFilterChange(filterKey, e.target.value)}
          className="focus-visible:ring-transparent"
        />
      </div>
      {categories.map((category) => (
        <ClickableCategory
          selected={selectedCategory?.uuid === category.uuid}
          key={category.uuid}
          label={category.name}
          onClick={() => onClick(category)}
        />
      ))}
    </div>
  );
  return (
    <DropdownMenu onOpenChange={onOpenChangeAction} open={open}>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            "items-center justify-between flex h-8 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs",
            open ? "border-2 border-primary" : undefined,
          )}
        >
          <p className="text-gray-500">
            {selectedCategories.length
              ? selectedCategories.map((category) => category.name).join(" > ")
              : "Select a Category"}
          </p>
          <div>{open ? <FaAngleUp /> : <FaAngleDown />}</div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex-col border border-gray-400 space-y-2 p-2 w-lg md:w-2xl xl:w-5xl">
        <div className="grid grid-cols-3 gap-2">
          {renderColumn(
            "Root",
            rootCategories,
            onClickRoot,
            "root",
            selectedCategories[0],
          )}
          {renderColumn(
            "Sub",
            subCategories,
            onClickSub,
            "sub",
            selectedCategories[1],
          )}
          {renderColumn(
            "SubChild",
            subChildCategories,
            onClickSubChild,
            "subchild",
            selectedCategories[2],
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// interface IRecentlyChosenItem {
//   label: string;
//   selected?: boolean;
// }
//
// const RecentlyChosenItem = ({ label, selected }: IRecentlyChosenItem) => (
//   <p
//     className={cn(
//       "text-sm rounded-md  p-1 cursor-pointer",
//       selected ? "border border-primary text-primary" : "bg-slate-200",
//     )}
//   >
//     {label}
//   </p>
// );

const ClickableCategory = ({
  label,
  onClick,
  selected,
}: {
  label: string;
  onClick: () => void;
  selected?: boolean;
}) => (
  <p
    className={cn(
      `cursor-pointer hover:bg-slate-200 p-1 rounded text-sm`,
      selected ? `bg-slate-200` : undefined,
    )}
    onClick={onClick}
  >
    {label}
  </p>
);
