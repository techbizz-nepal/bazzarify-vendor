import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";
import { TAttribute, TSpecification } from "@/modules/product.management";

interface ICategorySpecificationsCard {
  specifications: TSpecification[];
  selectedIds: string[] | null;
  onSpecificationChange: (id: TAttribute["uuid"]) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onPerPageChange: (value: string) => void;
  onUpdateAction: (entity: "specifications" | "attributes") => void;
}

const CategorySpecificationsCard = ({
  onSpecificationChange,
  selectedIds,
  specifications,
  onPreviousPage,
  onNextPage,
  onPerPageChange,
  onUpdateAction,
}: ICategorySpecificationsCard) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex-col space-y-7">
          <div className="flex justify-between">
            <CardTitle className="text-lg">Specifications</CardTitle>
            <ThemedButton onClick={() => onUpdateAction("specifications")}>
              Update Specifications
            </ThemedButton>
          </div>
          <p className="text-sm text-muted-foreground">
            Specifications enrich product metadata, but they do not make a
            category sellable on their own.
          </p>
          <div className="flex space-x-8">
            {/*<Input*/}
            {/*  placeholder="filter"*/}
            {/*  className="max-w-sm focus-visible:ring-primary h-10"*/}
            {/*/>*/}
            <Select onValueChange={onPerPageChange}>
              <SelectTrigger className="w-[180px]">
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
            : "N/A"}
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
