import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/drop-down";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TCategory } from "@/modules/product.management";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

interface ICategoryDropdown {
  open: boolean;
  onOpenChangeAction: () => void;
  rootCategories: TCategory[];
  subCategories: TCategory[];
  subChildCategories: TCategory[];
  committedCategories: TCategory[];
  onClickRoot: (category: TCategory) => void;
  onClickSub: (category: TCategory) => void;
  onClickSubChild: (category: TCategory) => void;
  onCommitSelectedCategory: () => void;
  onFilterChange: (level: "root" | "sub" | "subchild", value: string) => void;
  selectedCategories: TCategory[] | [];
  invalid?: boolean;
  errorMessage?: string;
  categoryChangeLocked?: boolean;
  lockedSelectionMessage?: string;
}

export default function CategoryDropdown({
  open,
  onOpenChangeAction,
  rootCategories,
  subCategories,
  subChildCategories,
  committedCategories,
  onClickRoot,
  onClickSub,
  onClickSubChild,
  onCommitSelectedCategory,
  onFilterChange,
  selectedCategories,
  invalid = false,
  errorMessage,
  categoryChangeLocked = false,
  lockedSelectionMessage,
}: ICategoryDropdown) {
  const currentCategory = selectedCategories.at(-1) ?? null;
  const isReadOnly = categoryChangeLocked && committedCategories.length > 0;
  const selectedPath = selectedCategories.map((category) => category.name).join(" > ");
  const committedPath = committedCategories
    .map((category) => category.name)
    .join(" > ");
  const hasUncommittedSelection =
    selectedCategories.length > 0 &&
    selectedCategories.at(-1)?.uuid !== committedCategories.at(-1)?.uuid;

  const renderColumn = (
    categories: TCategory[],
    onClick: (category: TCategory) => void,
    filterKey: "root" | "sub" | "subchild",
    selectedCategory: TCategory | { uuid: string } | undefined,
  ) => (
    <div className="h-96 flex-col space-y-3 overflow-y-scroll px-2">
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

  if (isReadOnly) {
    return (
      <div>
        <div
          className={cn(
            "flex h-8 w-full min-w-0 items-center rounded-md border bg-muted/20 px-3 py-1 text-base shadow-xs",
            invalid && "border-destructive",
          )}
          aria-disabled="true"
        >
          <p className="truncate text-gray-500">
            {committedCategories.length ? committedPath : "No category committed yet."}
          </p>
        </div>
        {errorMessage && (
          <p className="pt-2 text-sm text-destructive">{errorMessage}</p>
        )}
      </div>
    );
  }

  return (
    <DropdownMenu onOpenChange={onOpenChangeAction} open={open}>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            "flex h-8 w-full min-w-0 items-center justify-between rounded-md border bg-transparent px-3 py-1 text-base shadow-xs",
            invalid && "border-destructive",
            open ? "border-primary border-2" : undefined,
          )}
        >
          <p className="truncate text-gray-500">
            {committedCategories.length
              ? committedPath
              : selectedCategories.length
                ? selectedPath
                : "Select a Category"}
          </p>
          <div className="shrink-0">
            {open ? <FaAngleUp /> : <FaAngleDown />}
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-lg flex-col space-y-4 border border-gray-400 p-3 md:w-2xl xl:w-5xl">
        <div className="grid grid-cols-3 gap-2">
          {renderColumn(
            rootCategories,
            onClickRoot,
            "root",
            selectedCategories[0],
          )}
          {renderColumn(
            subCategories,
            onClickSub,
            "sub",
            selectedCategories[1],
          )}
          {renderColumn(
            subChildCategories,
            onClickSubChild,
            "subchild",
            selectedCategories[2],
          )}
        </div>
        <div className="rounded-md border bg-muted/30 p-3">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Committed Category
            </p>
            <p className="text-sm">
              {committedCategories.length
                ? committedPath
                : "No category committed yet."}
            </p>
          </div>
          <div className="mt-3 space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Current Selection
            </p>
            <p className="text-sm">
              {selectedCategories.length
                ? selectedPath
                : "Select a category path."}
            </p>
            {currentCategory && !currentCategory.is_sellable && (
              <p className="text-sm text-muted-foreground">
                Choose a category that already defines product fields to
                continue.
              </p>
            )}
            {currentCategory?.is_sellable && hasUncommittedSelection && (
              <p className="text-sm text-muted-foreground">
                {categoryChangeLocked && lockedSelectionMessage
                  ? lockedSelectionMessage
                  : "Use this category to refresh specifications and variant configuration for the selected node."}
              </p>
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              onClick={onCommitSelectedCategory}
              disabled={
                !currentCategory ||
                !currentCategory.is_sellable ||
                (categoryChangeLocked && hasUncommittedSelection)
              }
            >
              Use this category
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
      {errorMessage && (
        <p className="pt-2 text-sm text-destructive">{errorMessage}</p>
      )}
    </DropdownMenu>
  );
}

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
      "cursor-pointer rounded p-1 text-sm hover:bg-slate-200",
      selected ? "bg-slate-200" : undefined,
    )}
    onClick={onClick}
  >
    {label}
  </p>
);
