"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TAdminUserListItem } from "@/modules/auth/domain/schemas/payloads/AdminUserIndexPayloadSchema";
import DynamicTable, {
  TableColumn,
} from "@/modules/core/components/client/DynamicTable";
import TableFilterToolbar from "@/modules/core/components/client/TableFilterToolbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const columns: TableColumn<TAdminUserListItem>[] = [
  { key: "name", title: "Name" },
  { key: "email", title: "Email" },
  { key: "phone", title: "Phone" },
  { key: "authType", title: "Auth Type" },
  {
    key: "roles",
    title: "Roles",
    render: (_, record) => record.roles.join(", ") || "-",
  },
  { key: "created_at", title: "Created At" },
  {
    key: "uuid",
    title: "Action",
    render: (_, record) => (
      <Button asChild size="sm" variant="outline">
        <Link href={`/users/${record.uuid}`}>View</Link>
      </Button>
    ),
    align: "right",
  },
];

interface UsersVisibilityTableProps {
  rows: TAdminUserListItem[];
  initialFilters: Record<string, string>;
}

export default function UsersVisibilityTable({
  rows,
  initialFilters,
}: UsersVisibilityTableProps) {
  const router = useRouter();
  const [searchDraft, setSearchDraft] = useState(initialFilters.name ?? "");
  const [filters, setFilters] = useState<Record<string, string>>(initialFilters);

  const navigateWithFilters = (nextFilters: Record<string, string>) => {
    const searchParams = new URLSearchParams();

    if (nextFilters.name) {
      searchParams.set("name", nextFilters.name);
    }

    const query = searchParams.toString();
    router.push(query.length > 0 ? `/users?${query}` : "/users");
  };

  const handleSearchSubmit = () => {
    const nextFilters = {
      ...filters,
      name: searchDraft.trim(),
    };
    setFilters(nextFilters);
    navigateWithFilters(nextFilters);
  };

  const handleFilterChange = (key: string, value: string) => {
    const nextFilters = {
      ...filters,
      [key]: value,
    };
    setFilters(nextFilters);
    navigateWithFilters(nextFilters);
  };

  const handleFilterClear = (key: string) => {
    const nextFilters = { ...filters };
    delete nextFilters[key];
    if (key === "name") {
      setSearchDraft("");
    }
    setFilters(nextFilters);
    navigateWithFilters(nextFilters);
  };

  return (
    <Card className="space-y-4 p-4 shadow-md">
      <TableFilterToolbar
        searchValue={searchDraft}
        onSearchValueChange={setSearchDraft}
        onSearchSubmit={handleSearchSubmit}
        filters={filters}
        filterDefinitions={[]}
        onFilterChange={handleFilterChange}
        onFilterClear={handleFilterClear}
      />
      <DynamicTable
        columns={columns}
        data={rows}
        emptyMessage="No users found for the current filters."
      />
    </Card>
  );
}
