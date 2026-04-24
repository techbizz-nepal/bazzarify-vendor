import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TAdminUserDetail } from "@/modules/auth/domain/schemas/payloads/AdminUserDetailPayloadSchema";

function renderValue(value: string | null | undefined) {
  return value && value.length > 0 ? value : "-";
}

export default function UserDetailView({ user }: { user: TAdminUserDetail }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">User Details</CardTitle>
          <CardDescription>Read-only platform user summary.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Name: {renderValue(user.name)}</p>
          <p>Email: {renderValue(user.email)}</p>
          <p>Phone: {renderValue(user.phone)}</p>
          <p>Auth Type: {user.authType}</p>
          <p>Roles: {user.roles.join(", ") || "-"}</p>
          <p>Store Status: {user.store_status}</p>
          <p>Email Verified: {renderValue(user.email_verified_at)}</p>
          <p>Phone Verified: {renderValue(user.phone_verified_at)}</p>
          <p>Created At: {renderValue(user.created_at)}</p>
          <p>Updated At: {renderValue(user.updated_at)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Store Context</CardTitle>
          <CardDescription>
            Available when the actor is vendor-linked.
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
              No store is linked to this user.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
