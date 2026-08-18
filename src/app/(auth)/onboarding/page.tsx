import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { actionGetVendorOnboardingSurface } from "@/modules/vendor/domain/actions/getVendorOnboardingSurface";
import type { TOnboardingSurface } from "@/modules/vendor/domain/schemas/onboarding-surface";
import { AlertTriangle, Check, Circle, LockKeyhole } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Vendor onboarding",
};

const statusIcon = (state: TOnboardingSurface["status"][number]["state"]) => {
  if (state === "complete") {
    return <Check className="size-4 text-emerald-600" aria-hidden />;
  }
  if (state === "current") {
    return <Circle className="size-4 fill-primary text-primary" aria-hidden />;
  }
  return <LockKeyhole className="text-muted-foreground size-4" aria-hidden />;
};

function OnboardingSurface({ surface }: { surface: TOnboardingSurface }) {
  const displayName =
    surface.vendor.store_name ?? surface.vendor.name ?? "vendor";
  const percentage = surface.progress.percentage;

  return (
    <PageContainer pageTitle="Onboarding">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Good afternoon, {displayName}</CardTitle>
            <CardDescription>
              Complete the required steps before accessing vendor KPIs and
              selling tools.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>{percentage}% through onboarding</span>
              <span className="text-muted-foreground">
                Estimated remaining steps:{" "}
                {surface.progress.estimated_remaining_steps}
              </span>
            </div>
            <div
              className="bg-muted h-2 overflow-hidden rounded-full"
              role="progressbar"
              aria-label="Onboarding progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percentage}
            >
              <div
                className="bg-primary h-full rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Next action</CardTitle>
              <CardDescription>
                Required to continue onboarding.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-amber-500/40 bg-amber-500/5 flex items-start gap-3 rounded-md border p-4">
                <AlertTriangle
                  className="mt-0.5 size-4 text-amber-600"
                  aria-hidden
                />
                <div className="space-y-1">
                  <p className="font-medium">{surface.next_action.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {surface.next_action.description}
                  </p>
                </div>
              </div>
              <Button asChild>
                <Link href={surface.next_action.action.href}>
                  {surface.next_action.action.label}
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Onboarding status</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {surface.status.map((step) => (
                  <li
                    key={step.key}
                    className="flex items-center gap-2 text-sm"
                  >
                    {statusIcon(step.state)}
                    <span
                      className={
                        step.state === "locked" ? "text-muted-foreground" : ""
                      }
                    >
                      {step.label}
                    </span>
                    {step.state === "current" && (
                      <Badge variant="secondary" className="ml-auto">
                        In progress
                      </Badge>
                    )}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {surface.tasks.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No open onboarding tasks.
              </p>
            ) : (
              <ul className="divide-y">
                {surface.tasks.map((task) => (
                  <li
                    key={task.key}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-muted-foreground text-sm">Required</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={task.action.href}>{task.action.label}</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            {surface.recent_activity.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No onboarding activity recorded yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {surface.recent_activity.map((event) => (
                  <li
                    key={event.key}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{event.label}</span>
                    <span className="text-muted-foreground">
                      {event.at ?? "—"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

export default async function OnboardingPage() {
  const result = await actionGetVendorOnboardingSurface();

  if ("error" in result) {
    return (
      <PageContainer pageTitle="Onboarding">
        <div className="text-destructive flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <AlertTriangle className="size-4" aria-hidden />
          <span>{result.error}</span>
        </div>
      </PageContainer>
    );
  }

  if (result.mode === "dashboard") {
    redirect(result.redirect_to);
  }

  return <OnboardingSurface surface={result} />;
}
