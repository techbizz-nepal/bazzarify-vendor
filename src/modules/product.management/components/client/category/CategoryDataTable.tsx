import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";
import { IDataTableProps, TCategory } from "@/modules/product.management";
import { FaAngleRight } from "react-icons/fa6";

export default function CategoryDataTable({
  page,
  data,
  onNextAction,
  onPreviousAction,
  rowsCount,
  onEditAction,
  onViewAction,
  onFilterChangeAction,
  onOnlyLastChildrenAction,
}: IDataTableProps<TCategory>) {
  return (
    <Card className="px-4" id="stats">
      {rowsCount > 0 ? (
        <>
          <CardHeader>
            <div className="flex-col space-y-2">
              <div>Total {rowsCount} records.</div>
              <div className="flex items-center space-x-8">
                <Input
                  name="name"
                  onChange={onFilterChangeAction}
                  placeholder="filter by name"
                  className="focus-visible:ring-primary w-44"
                />
                <ThemedButton
                  onClick={onOnlyLastChildrenAction}
                  className="hover:animate-pulse"
                >
                  List Only Last Children
                </ThemedButton>
              </div>
            </div>
          </CardHeader>
          <CardDescription>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-3/12">Category</TableHead>
                  <TableHead className="w-3/12">Parent</TableHead>
                  <TableHead className="w-3/12">Children</TableHead>
                  <TableHead className="w-3/12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data &&
                  data.data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="font-medium">
                        {item.parent ? item.parent.name : "N/A"}
                      </TableCell>
                      <TableCell className="max-w-3xl truncate font-medium">
                        {item.children?.length
                          ? item.children.map((child) => child.name).join(", ")
                          : "N/A"}
                      </TableCell>
                      <TableCell className="flex items-center space-x-2">
                        <ThemedButton
                          variant="secondary"
                          onClick={() => onEditAction(item.slug)}
                        >
                          Edit
                        </ThemedButton>
                        <ThemedButton
                          variant="default"
                          onClick={() => onViewAction(item.slug)}
                        >
                          View
                        </ThemedButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className="text-left" colSpan={3}>
                    {data?.from} to {data?.to} records
                  </TableCell>
                  <TableCell className="flex justify-end space-x-8">
                    <ThemedButton
                      onClick={onPreviousAction}
                      disabled={page === 1}
                    >
                      Previous
                    </ThemedButton>
                    <ThemedButton onClick={onNextAction}>
                      Next <FaAngleRight />
                    </ThemedButton>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardDescription>
        </>
      ) : (
        <div className="flex-row items-center justify-items-center">
          <h1>No Records Available</h1>
        </div>
      )}
    </Card>
  );
}
