import PageContainer from "@/modules/core/components/server/PageContainer";
import {
  getAuthUser,
  getSessionUserUUID,
} from "@/modules/auth/data/lib/auth-lib";
import { actionGetUsers } from "@/modules/auth/domain/auth-actions";
import { getCookieStore } from "@/modules/core/lib/utils.session";
import UsersVisibilityTable from "@/modules/admin/users/components/client/UsersVisibilityTable";
import { redirect } from "next/navigation";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    name?: string;
  }>;
}) {
  const userUuid = await getSessionUserUUID(await getCookieStore());
  if (!userUuid) {
    redirect("/login");
  }

  const authUser = await getAuthUser(userUuid);
  const isSuperAdmin =
    authUser &&
    typeof authUser === "object" &&
    !("error" in authUser) &&
    authUser.roles.some((role) => role.name === "super-admin");

  if (!isSuperAdmin) {
    redirect("/");
  }

  const resolvedSearchParams = await searchParams;
  const initialFilters = {
    name: resolvedSearchParams.name ?? "",
  };
  const usersResponse = await actionGetUsers({
    filter: {
      ...initialFilters,
      role: "consumer",
    },
  });
  const rows =
    usersResponse && typeof usersResponse === "object" && "users" in usersResponse
      ? usersResponse.users
      : [];

  return (
    <PageContainer pageTitle="Manage Users">
      <UsersVisibilityTable rows={rows} initialFilters={initialFilters} />
    </PageContainer>
  );
}
