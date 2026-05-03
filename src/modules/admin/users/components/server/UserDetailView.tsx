import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AdminUserRoleManagementCard from "@/modules/admin/users/components/client/AdminUserRoleManagementCard";
import { TAdminUserDetail } from "@/modules/auth/domain/schemas/payloads/AdminUserDetailPayloadSchema";

function renderValue(value: string | null | undefined) {
  return value && value.length > 0 ? value : "-";
}

interface UserDetailViewProps {
  user: TAdminUserDetail;
  audience?: "consumer" | "vendor";
}

export default function UserDetailView({
  user,
  audience = "consumer",
}: UserDetailViewProps) {
  const isVendorView = audience === "vendor";

  return (
    <div className={`grid gap-4 ${isVendorView ? "md:grid-cols-2" : ""}`}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isVendorView ? "Vendor Details" : "User Details"}
          </CardTitle>
          <CardDescription>
            {isVendorView
              ? "Read-only vendor account summary."
              : "Read-only consumer account summary."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Name: {renderValue(user.name)}</p>
          <p>Email: {renderValue(user.email)}</p>
          <p>Phone: {renderValue(user.phone)}</p>
          <p>Auth Type: {user.authType}</p>
          {isVendorView ? <p>Roles: {user.roles.join(", ") || "-"}</p> : null}
          {isVendorView ? <p>Store Status: {user.store_status}</p> : null}
          <p>Email Verified: {renderValue(user.email_verified_at)}</p>
          <p>Phone Verified: {renderValue(user.phone_verified_at)}</p>
          <p>Created At: {renderValue(user.created_at)}</p>
          <p>Updated At: {renderValue(user.updated_at)}</p>
        </CardContent>
      </Card>
      <AdminUserRoleManagementCard
        userUuid={user.uuid}
        roles={user.roles}
        hasStore={user.has_store}
        audience={audience}
      />
      {isVendorView ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Store Context</CardTitle>
            <CardDescription>
              Available when the vendor account is linked to a store.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {user.store ? (
              <>
                <p>Store Name: {renderValue(user.store.name)}</p>
                <p>
                  Store Type: {renderValue(user.store.store_type_name ?? null)}
                </p>
                <p>Store Email: {renderValue(user.store.email)}</p>
                <p>Store Phone: {renderValue(user.store.phone)}</p>
                <p>Slug: {renderValue(user.store.slug)}</p>
                <p>Short Name: {renderValue(user.store.short_name)}</p>
                <p>Description: {renderValue(user.store.short_description)}</p>
                <p>City: {renderValue(user.store.city)}</p>
                <p>Province: {renderValue(user.store.province)}</p>
                <p>Country: {renderValue(user.store.country)}</p>
                <p>Assigned Categories: {user.store.category_count ?? 0}</p>
                <p>
                  Product Authoring Ready:{" "}
                  {user.store.product_authoring_ready ? "Yes" : "No"}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">
                No store is linked to this vendor.
              </p>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
