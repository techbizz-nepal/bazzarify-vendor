"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DataTable from "@/modules/core/components/client/DataTable";
import { actionGetCategories } from "@/modules/product.management/actions/category";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

export default function Create() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <p className="text-2xl">Manage Categories</p>
        </CardTitle>
        <CardDescription>
          manage your categories with creating, updating and assigning
          attributes and specifications
        </CardDescription>
        <CardAction>
          <Link href="/categories/create">
            <Button variant="default" size="sm">
              <FaPlus className="mr-2" />
              New Category
            </Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <DataTable
          entityKey="categories"
          columns={[
            { label: "Name", accessor: "name" },
            { label: "Created At", accessor: "created_at" },
            { label: "Updated At", accessor: "updated_at" },
          ]}
          fetchAction={actionGetCategories}
          filterOptions={[
            { label: "Root Only", value: "true", key: "rootOnly" },
            { label: "Leaf Only", value: "true", key: "leafOnly" },
            { label: "Trashed", value: "only", key: "trashed" },
          ]}
          defaultFilter="rootOnly"
        />
      </CardContent>
    </Card>
  );
}
