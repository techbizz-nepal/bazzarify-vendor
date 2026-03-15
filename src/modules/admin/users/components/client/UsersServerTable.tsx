"use client";

import { TAdminUserListItem } from "@/modules/auth/domain/schemas/payloads/AdminUserIndexPayloadSchema";
import ServerDataTable from "@/modules/core/components/client/ServerDataTable";
import { TableColumn } from "@/modules/core/components/client/DynamicTable";
import { TServerDataTableMeta } from "@/modules/core/domain/schemas/ServerDataTableMeta";

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

interface UsersServerTableProps {
  rows: TAdminUserListItem[];
  table: TServerDataTableMeta;
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
  table,
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
      table={table}
      initialFilters={initialFilters}
      pagination={pagination}
      rowActions={[
        { label: "View", hrefTemplate: "/users/:uuid", variant: "default" },
      ]}
    />
  );
}
