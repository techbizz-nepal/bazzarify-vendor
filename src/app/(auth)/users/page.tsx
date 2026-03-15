import PageContainer from "@/modules/core/components/server/PageContainer";
import {
  getAuthUser,
  getSessionUserUUID,
} from "@/modules/auth/data/lib/auth-lib";
import { actionGetUsers } from "@/modules/auth/domain/auth-actions";
import { getCookieStore } from "@/modules/core/lib/utils.session";
import UsersServerTable from "@/modules/admin/users/components/client/UsersServerTable";
import { redirect } from "next/navigation";

const normalizeSingleValue = (
  value: string | string[] | undefined,
): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string | string[];
    page?: string | string[];
    role?: string | string[];
    has_store?: string | string[];
    store_status?: string | string[];
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
  const search = normalizeSingleValue(resolvedSearchParams.search) ?? "";
  const page = Number(normalizeSingleValue(resolvedSearchParams.page) ?? "1");
  const role = normalizeSingleValue(resolvedSearchParams.role) ?? "";
  const hasStore = normalizeSingleValue(resolvedSearchParams.has_store) ?? "";
  const storeStatus =
    normalizeSingleValue(resolvedSearchParams.store_status) ?? "";
  const initialFilters = {
    search,
    ...(role ? { role } : {}),
    ...(hasStore ? { has_store: hasStore } : {}),
    ...(storeStatus ? { store_status: storeStatus } : {}),
  };
  const usersResponse = await actionGetUsers({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    filter: {
      ...(search ? { name: search } : {}),
      ...(role ? { role } : {}),
      ...(hasStore ? { has_store: hasStore } : {}),
      ...(storeStatus ? { store_status: storeStatus } : {}),
    },
  });
  const rows =
    usersResponse && typeof usersResponse === "object" && "users" in usersResponse
      ? (usersResponse.users.data ?? [])
      : [];
  const users =
    usersResponse && typeof usersResponse === "object" && "users" in usersResponse
      ? usersResponse.users
      : null;

  return (
    <PageContainer pageTitle="Manage Users">
      <UsersServerTable
        rows={rows}
        initialFilters={initialFilters}
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
