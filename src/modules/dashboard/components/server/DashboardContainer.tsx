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
import PageContainer from "@/modules/core/components/server/PageContainer";
import { getSessionPayload } from "@/modules/core/lib/utils.session";
import SetBusinessAndEmailForm from "@/modules/guest/components/client/registration/SetBusinessAndEmailForm";
import { headers } from "next/headers";

export default async function DashboardContainer() {
  const host = (await headers()).get("host") || "";
  const sessionPayload = await getSessionPayload();

  return (
    <PageContainer pageTitle={"Dashboard"}>
      <Statistics />
      {host.startsWith("vendor.") && !sessionPayload?.store && (
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
                <SetBusinessAndEmailForm />
              </SheetContent>
            </Sheet>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}

const Statistics = () => (
  <Card className="items-center justify-center px-4" id="stats">
    <p>Welcome to dashboard.</p>
  </Card>
);
