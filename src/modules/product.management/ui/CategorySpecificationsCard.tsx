import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ContentSkeleton from "@/modules/core/components/server/ContentSkeleton";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";
import { TAttribute, TSpecification } from "@/modules/product.management";
import { random } from "nanoid";

interface ICategorySpecificationsCard {
  specifications: TSpecification[];
  selectedIds: string[] | null;
  feedbackMessage?: string | null;
  searchValue: string;
  perPageValue: string;
  isFetching?: boolean;
  onSpecificationChange: (id: TAttribute["uuid"]) => void;
  onSearchChange: (value: string) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onPerPageChange: (value: string) => void;
  onFilterAction: () => void;
  onUpdateAction: () => void;
}

const CategorySpecificationsCard = ({
  onSpecificationChange,
  selectedIds,
  specifications,
  onPreviousPage,
  onNextPage,
  onPerPageChange,
  feedbackMessage,
  searchValue,
  perPageValue,
  isFetching,
  onSearchChange,
  onFilterAction,
  onUpdateAction,
}: ICategorySpecificationsCard) => {
  const renderSkeletonRows = () =>
    Array.from({ length: 9 }).map((_, index) => (
      <ContentSkeleton key={random(3).toString()} />
    ));

  return (
    <Card>
      <CardHeader>
        <div className="flex-col space-y-7">
          <div className="flex justify-between">
            <CardTitle className="text-lg">Specifications</CardTitle>
            <ThemedButton onClick={onUpdateAction}>
              Update Specifications
            </ThemedButton>
          </div>
          <p className="text-sm text-muted-foreground">
            Specifications enrich product metadata, but they do not make a
            category sellable on their own.
          </p>
          {feedbackMessage ? (
            <p className="text-sm font-medium text-destructive">
              {feedbackMessage}
            </p>
          ) : null}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full flex-col gap-3 lg:max-w-xl lg:flex-row lg:items-center">
              <Input
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search specifications..."
                className="max-w-sm focus-visible:ring-primary"
              />
              <ThemedButton onClick={onFilterAction}>Filter</ThemedButton>
            </div>
            <Select value={perPageValue} onValueChange={onPerPageChange}>
              <SelectTrigger className="w-45">
                <SelectValue placeholder="Per Page" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="45">45</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative min-h-60">
          <div className={isFetching ? "pointer-events-none opacity-40" : ""}>
            <div className="grid grid-cols-3 space-x-2">
              {specifications.length > 0
                ? specifications.map((item) => (
                    <div
                      className="flex items-center space-x-2 uppercase"
                      key={item.uuid}
                    >
                      <div>
                        <Checkbox
                          checked={selectedIds?.includes(item.uuid)}
                          onClick={() => onSpecificationChange(item.uuid)}
                        />
                      </div>
                      <div>{item.key.replaceAll("-", " ")}</div>
                    </div>
                  ))
                : renderSkeletonRows()}
            </div>
          </div>
          {isFetching ? (
            <div className="absolute inset-0 grid grid-cols-3 content-start gap-y-4 bg-background/60 p-1 backdrop-blur-[1px]">
              {renderSkeletonRows()}
            </div>
          ) : null}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-end space-x-8">
        <ThemedButton onClick={onPreviousPage}>Previous</ThemedButton>
        <ThemedButton onClick={onNextPage}>Next</ThemedButton>
      </CardFooter>
    </Card>
  );
};
export default CategorySpecificationsCard;
