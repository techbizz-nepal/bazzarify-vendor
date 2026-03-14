import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getAuthUser,
  getSessionUserUUID,
} from "@/modules/auth/data/lib/auth-lib";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";
import { getCookieStore } from "@/modules/core/lib/utils.session";
import SetBusinessAndEmailForm from "@/modules/guest/components/client/registration/SetBusinessAndEmailForm";
import { actionGetStoreTypeOptions } from "@/modules/vendor/domain/store-actions";
import {
  DEFAULT_STORE_REQUIREMENT_RETURN_PATH,
  sanitizeVendorReturnPath,
} from "@/modules/vendor/domain/storeRequirementNavigation";
import { redirect } from "next/navigation";

interface StoreRequiredPageProps {
  searchParams: Promise<{
    returnTo?: string;
  }>;
}

export default async function StoreRequiredPage({
  searchParams,
}: StoreRequiredPageProps) {
  const { returnTo } = await searchParams;
  const safeReturnTo = sanitizeVendorReturnPath(
    returnTo,
    DEFAULT_STORE_REQUIREMENT_RETURN_PATH,
  );

  const userUuid = await getSessionUserUUID(await getCookieStore());
  if (userUuid) {
    const authUser = await getAuthUser(userUuid);
    if (authUser && !("error" in authUser) && authUser.store) {
      redirect(safeReturnTo);
    }
  }

  const storeTypeOptions = await actionGetStoreTypeOptions();

  return (
    <PageContainer pageTitle="Store Required">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create your store before managing products</CardTitle>
            <CardDescription>
              Product management is store-scoped in Bazarify. Create your store
              first, then continue with product authoring.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border bg-slate-50 p-4 text-sm text-slate-700">
              Pick the store type that fits your business. Bazarify will assign
              the starter categories for that type as part of store creation,
              then return you to your intended product flow.
            </div>
            <SetBusinessAndEmailForm
              redirectTo={safeReturnTo}
              storeTypeOptions={storeTypeOptions}
            />
            <ThemedButton variant="outline" asChild className="w-full">
              <Link href="/">Back to dashboard</Link>
            </ThemedButton>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
