import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  getAuthUser,
  getSessionUserUUID,
} from "@/modules/auth/data/lib/auth-lib";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { getCookieStore } from "@/modules/core/lib/utils.session";
import SetBusinessAndEmailForm from "@/modules/guest/components/client/registration/SetBusinessAndEmailForm";
import { actionGetStoreTypeOptions } from "@/modules/vendor/domain/store-actions";
import { Loader } from "lucide-react";
import { headers } from "next/headers";
import { Suspense } from "react";

export default async function DashboardContainer() {
  const host = (await headers()).get("host") || "";
  const userUUID = await getSessionUserUUID(await getCookieStore());
  if (!userUUID) {
    console.log("no token on dashboard: ", userUUID);
    return null;
  }
  const authUser = await getAuthUser(userUUID);
  if (authUser && "error" in authUser) {
    console.log("auth user: ", authUser);
    return null;
  }
  const storeTypeOptions = await actionGetStoreTypeOptions();
  return (
    <Suspense fallback={<Loader />}>
      <PageContainer pageTitle={"Dashboard"}>
        <Statistics />
        {host.startsWith("vendor.") && !authUser?.store && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-destructive">
                Due Work !!!
              </CardTitle>
              <CardDescription className="text-center text-destructive">
                You have not set your Store Information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="default">Update Store</Button>
                </SheetTrigger>

                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-bold">
                      Store Information
                    </SheetTitle>
                  </SheetHeader>
                  <SetBusinessAndEmailForm
                    storeTypeOptions={storeTypeOptions}
                  />
                </SheetContent>
              </Sheet>
            </CardContent>
          </Card>
        )}
      </PageContainer>
    </Suspense>
  );
}

const Statistics = () => (
  <Card className="items-center justify-center px-4" id="stats">
    <p>Welcome to dashboard.</p>
  </Card>
);
