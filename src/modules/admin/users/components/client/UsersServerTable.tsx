"use client";

import { TAdminUserListItem } from "@/modules/auth/domain/schemas/payloads/AdminUserIndexPayloadSchema";
import ServerDataTable from "@/modules/core/components/client/ServerDataTable";
import { TableColumn } from "@/modules/core/components/client/DynamicTable";
import { FilterDefinition } from "@/modules/core/components/client/TableFilterToolbar";

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
  {
    key: "has_store",
    title: "Store",
    render: (value) => (value ? "Yes" : "No"),
  },
  {
    key: "store_status",
    title: "Store Readiness",
    render: (value) =>
      value === "ready"
        ? "Ready"
        : value === "needs_categories"
          ? "Needs Categories"
          : "No Store",
  },
  { key: "created_at", title: "Created At" },
];

const filterDefinitions: FilterDefinition[] = [
  {
    type: "select",
    key: "role",
    label: "Role",
    options: [
      { label: "Consumer", value: "consumer" },
      { label: "Vendor", value: "vendor" },
      { label: "Admin", value: "admin" },
      { label: "Super Admin", value: "super-admin" },
    ],
  },
  {
    type: "select",
    key: "has_store",
    label: "Store",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
  {
    type: "select",
    key: "store_status",
    label: "Store Readiness",
    options: [
      { label: "No Store", value: "no_store" },
      { label: "Needs Categories", value: "needs_categories" },
      { label: "Ready", value: "ready" },
    ],
  },
];

interface UsersServerTableProps {
  rows: TAdminUserListItem[];
  initialFilters: Record<string, string>;
  pagination: {
    currentPage: number;
    perPage?: number | null;
    from?: number | string | null;
    to?: number | string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export default function UsersServerTable({
  rows,
  initialFilters,
  pagination,
}: UsersServerTableProps) {
  return (
    <ServerDataTable
      title="Manage Users"
      description="Browse platform users with backend-owned filters and server-driven pagination."
      columns={columns}
      rows={rows}
      emptyMessage="No users found for the current filters."
      search={{
        queryKey: "search",
        value: initialFilters.search ?? "",
        placeholder: "Search users by name, email, or phone...",
      }}
      filters={filterDefinitions}
      initialFilters={initialFilters}
      pagination={pagination}
      rowActions={[
        { label: "View", hrefTemplate: "/users/:uuid", variant: "default" },
      ]}
    />
  );
}
