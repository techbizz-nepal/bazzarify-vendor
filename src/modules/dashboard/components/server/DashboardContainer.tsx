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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import PageContainer from "@/modules/core/components/server/PageContainer";
import SetBusinessAndEmailForm from "@/modules/guest/components/client/registration/SetBusinessAndEmailForm";

export default function DashboardContainer() {
  return (
    <PageContainer pageTitle={"Dashboard"}>
      <Statistics />
    </PageContainer>
  );
}

const Statistics = () => (
  <>
    <Card className="items-center justify-center px-4" id="stats">
      <p>Welcome to dashboard.</p>
    </Card>
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
              <SheetTitle>Set Business and Email</SheetTitle>
              <SheetDescription>short description</SheetDescription>
            </SheetHeader>
            <SetBusinessAndEmailForm />
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  </>
);
