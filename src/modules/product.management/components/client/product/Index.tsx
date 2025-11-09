import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DataTable from "@/modules/core/components/client/DataTable";
import { actionGetProducts } from "@/modules/product.management/actions/product";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

export default function Index() {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-y-5 md:items-center md:flex-row md:justify-between">
        <CardTitle>
          <p className="text-2xl">Manage Products</p>
        </CardTitle>
        <CardAction>
          <Link href="/products/create">
            <Button variant="default" size="sm">
              <FaPlus className="mr-2" />
              New Product
            </Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <DataTable
          entityKey="products"
          columns={[
            { label: "Category", accessor: "categories.name" },
            { label: "Name", accessor: "name" },
            { label: "Created By", accessor: "user.name" },
            { label: "Status", accessor: "status_text" },
            { label: "Created At", accessor: "created_at" },
            { label: "Updated At", accessor: "updated_at" },
          ]}
          fetchAction={actionGetProducts}
        />
      </CardContent>
    </Card>
  );
}
