"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { actionUpdateAdminUserRole } from "@/modules/auth/domain/admin-user-actions";
import { useRouter } from "next/navigation";
import { startTransition, useMemo, useState } from "react";
import { toast } from "sonner";

type ManagedRole = "consumer" | "vendor";

function getCurrentManagedRole(roles: string[]): ManagedRole | null {
  if (roles.includes("vendor")) {
    return "vendor";
  }

  if (roles.includes("consumer")) {
    return "consumer";
  }

  return null;
}

function getDefaultRole({
  roles,
  hasStore,
  audience,
}: {
  roles: string[];
  hasStore: boolean;
  audience: "consumer" | "vendor";
}): ManagedRole {
  return getCurrentManagedRole(roles) ?? (hasStore || audience === "vendor" ? "vendor" : "consumer");
}

interface AdminUserRoleManagementCardProps {
  userUuid: string;
  roles: string[];
  hasStore: boolean;
  audience: "consumer" | "vendor";
}

export default function AdminUserRoleManagementCard({
  userUuid,
  roles,
  hasStore,
  audience,
}: AdminUserRoleManagementCardProps) {
  const router = useRouter();
  const currentRole = useMemo(() => getCurrentManagedRole(roles), [roles]);
  const [selectedRole, setSelectedRole] = useState<ManagedRole>(
    getDefaultRole({ roles, hasStore, audience }),
  );
  const [isSaving, setIsSaving] = useState(false);

  const currentRoleLabel =
    currentRole === "consumer"
      ? "Consumer"
      : currentRole === "vendor"
        ? "Vendor"
        : "No role assigned";

  const helperText =
    currentRole === null
      ? hasStore
        ? "This account owns a store but still has no explicit role. Review and assign the correct role."
        : "This account is visible here because it still has no explicit role."
      : "Updating the role will replace the current consumer or vendor assignment for this account.";

  const handleSave = () => {
    setIsSaving(true);

    startTransition(() => {
      void actionUpdateAdminUserRole({
        userUuid,
        role: selectedRole,
      })
        .then((response) => {
          if ("metaData" in response) {
            toast.error(response.metaData.error);
            return;
          }

          toast.success(
            `Assigned ${selectedRole === "vendor" ? "vendor" : "consumer"} role successfully.`,
          );
          router.refresh();
        })
        .catch((error) => {
          const message =
            error instanceof Error
              ? error.message
              : "Unable to update the user role.";
          toast.error(message);
        })
        .finally(() => {
          setIsSaving(false);
        });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Role Management</CardTitle>
        <CardDescription>{helperText}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="space-y-1">
          <p>Current role: {currentRoleLabel}</p>
          <p>Suggested role: {hasStore ? "Vendor" : "Consumer"}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select
            value={selectedRole}
            onValueChange={(value) => setSelectedRole(value as ManagedRole)}
          >
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consumer">Consumer</SelectItem>
              <SelectItem value="vendor">Vendor</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleSave}
            disabled={isSaving || selectedRole === currentRole}
          >
            {isSaving ? "Saving..." : "Update Role"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
