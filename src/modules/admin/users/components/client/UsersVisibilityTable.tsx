"use client";

import { Card } from "@/components/ui/card";
import { TAdminUserListItem } from "@/modules/auth/domain/schemas/payloads/AdminUserIndexPayloadSchema";
import DynamicTable, {
  TableColumn,
} from "@/modules/core/components/client/DynamicTable";
import TableFilterToolbar, {
  FilterDefinition,
} from "@/modules/core/components/client/TableFilterToolbar";
import { useRouter } from "next/navigation";
import { useState } from "react";

const filterDefinitions: FilterDefinition[] = [
  {
    key: "has_store",
    label: "Store",
    options: [
      { label: "Has store", value: "yes" },
      { label: "No store", value: "no" },
    ],
  },
  {
    key: "store_status",
    label: "Store Status",
    options: [
      { label: "No store", value: "no_store" },
      { label: "Needs categories", value: "needs_categories" },
      { label: "Ready", value: "ready" },
    ],
  },
];

const statusLabels: Record<TAdminUserListItem["store_status"], string> = {
  no_store: "No store",
  needs_categories: "Needs categories",
  ready: "Ready",
};

const columns: TableColumn<TAdminUserListItem>[] = [
  { key: "name", title: "Name" },
  { key: "email", title: "Email" },
  { key: "phone", title: "Phone" },
  {
    key: "roles",
    title: "Roles",
    render: (_, record) =>
      record.roles.map((role) => role.name).filter(Boolean).join(", ") || "-",
  },
  {
    key: "store.name",
    title: "Store",
  },
  {
    key: "store.store_type_name",
    title: "Store Type",
  },
  {
    key: "store.category_count",
    title: "Categories",
    align: "center",
  },
  {
    key: "store_status",
    title: "Onboarding Status",
    render: (value) =>
      typeof value === "string" && value in statusLabels
        ? statusLabels[value as TAdminUserListItem["store_status"]]
        : "-",
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

    if (nextFilters.has_store) {
      searchParams.set("has_store", nextFilters.has_store);
    }

    if (nextFilters.store_status) {
      searchParams.set("store_status", nextFilters.store_status);
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
        filterDefinitions={filterDefinitions}
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
