import { TAttribute, TSpecification } from "@/modules/product.management";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
            <Button
              className="hover:animate-pulse"
              onClick={() => onUpdateAction("specifications")}
            >
              Update Specifications
            </Button>
          </div>
          <div className="flex space-x-8">
            <Input
              placeholder="filter"
              className="max-w-sm focus-visible:ring-primary h-10"
            />
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
                  className="uppercase flex space-x-2 items-center"
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
      <CardFooter className="flex  items-center justify-end space-x-8">
        <Button onClick={onPreviousPage}>Previous</Button>
        <Button onClick={onNextPage}>Next</Button>
      </CardFooter>
    </Card>
  );
};
export default CategorySpecificationsCard;
