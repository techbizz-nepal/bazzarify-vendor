import PageContainer from "@/modules/core/components/server/PageContainer";
import {
  getAuthUser,
  getSessionUserUUID,
} from "@/modules/auth/data/lib/auth-lib";
import { actionGetUsers } from "@/modules/auth/domain/auth-actions";
import { getCookieStore } from "@/modules/core/lib/utils.session";
import { flattenSearchParams } from "@/modules/core/utils/searchParams";
import UsersServerTable from "@/modules/admin/users/components/client/UsersServerTable";
import { redirect } from "next/navigation";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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
  const flattenedParams = flattenSearchParams(resolvedSearchParams);
  const page = Number(flattenedParams.page ?? "1");
  const usersResponse = await actionGetUsers({
    ...flattenedParams,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  });
  const rows =
    usersResponse && typeof usersResponse === "object" && "users" in usersResponse
      ? (usersResponse.users.data ?? [])
      : [];
  const users =
    usersResponse && typeof usersResponse === "object" && "users" in usersResponse
      ? usersResponse.users
      : null;
  const table =
    usersResponse &&
    typeof usersResponse === "object" &&
    "table" in usersResponse
      ? usersResponse.table
      : null;

  return (
    <PageContainer pageTitle="Manage Users">
      <UsersServerTable
        rows={rows}
        table={
          table ?? {
            search: {
              queryKey: "filter[name]",
              placeholder: "Search users by name, email, or phone...",
            },
            filters: [],
          }
        }
        initialFilters={Object.fromEntries(
          Object.entries(flattenedParams).filter(([key]) => key !== "page"),
        )}
        pagination={{
          currentPage: Number(users?.current_page ?? 1),
          perPage: users?.per_page ? Number(users.per_page) : null,
          from: users?.from ?? null,
          to: users?.to ?? null,
          hasNextPage: Boolean(users?.next_page_url),
          hasPreviousPage: Boolean(users?.prev_page_url),
        }}
      />
    </PageContainer>
  );
}
