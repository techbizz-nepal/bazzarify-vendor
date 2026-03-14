import PageContainer from "@/modules/core/components/server/PageContainer";
import { actionGetUsers } from "@/modules/auth/domain/auth-actions";
import UsersVisibilityTable from "@/modules/admin/users/components/client/UsersVisibilityTable";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    name?: string;
    has_store?: string;
    store_status?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const initialFilters = {
    name: resolvedSearchParams.name ?? "",
    has_store: resolvedSearchParams.has_store ?? "",
    store_status: resolvedSearchParams.store_status ?? "",
  };
  const usersResponse = await actionGetUsers({
    filter: initialFilters,
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
