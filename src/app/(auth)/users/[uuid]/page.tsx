import UserDetailView from "@/modules/admin/users/components/server/UserDetailView";
import { actionGetUserByUuid } from "@/modules/auth/domain/auth-actions";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { notFound, redirect } from "next/navigation";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  const response = await actionGetUserByUuid(uuid);

  if ("error" in response) {
    if (response.errorCode === 401) {
      redirect("/login");
    }

    if (response.errorCode === 403) {
      redirect("/");
    }

    notFound();
  }

  return (
    <PageContainer
      pageTitle={`User ${response.user.name ?? response.user.email ?? uuid}`}
    >
      <UserDetailView user={response.user} audience="consumer" />
    </PageContainer>
  );
}
