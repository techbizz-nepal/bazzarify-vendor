import {
  getAuthUser,
  getSessionUserUUID,
} from "@/modules/auth/data/lib/auth-lib";
import PageContainer from "@/modules/core/components/server/PageContainer";
import { getCookieStore } from "@/modules/core/lib/utils.session";
import { actionGetDashboardSummary } from "@/modules/dashboard/actions/getDashboardSummary";
import DashboardAttentionList from "@/modules/dashboard/components/client/DashboardAttentionList";
import DashboardKpiGrid from "@/modules/dashboard/components/client/DashboardKpiGrid";
import DashboardPeriodToggle from "@/modules/dashboard/components/client/DashboardPeriodToggle";
import DashboardRecentActivity from "@/modules/dashboard/components/client/DashboardRecentActivity";
import DashboardTopStores from "@/modules/dashboard/components/client/DashboardTopStores";
import {
  DASHBOARD_WINDOWS,
  type DashboardWindow,
} from "@/modules/dashboard/schemas/dashboard-summary-schema";
import { AlertTriangle } from "lucide-react";

type Props = {
  searchParams?: Promise<{ window?: string }>;
};

const resolveWindow = (raw?: string): DashboardWindow =>
  (DASHBOARD_WINDOWS as readonly string[]).includes(raw ?? "")
    ? (raw as DashboardWindow)
    : "7d";

export default async function DashboardContainer({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const window = resolveWindow(params.window);

  const userUUID = await getSessionUserUUID(await getCookieStore());
  if (!userUUID) {
    return null;
  }
  const authUser = await getAuthUser(userUUID);
  if (authUser && "error" in authUser) {
    return null;
  }

  const result = await actionGetDashboardSummary(window);

  if ("error" in result) {
    return (
      <PageContainer pageTitle="Dashboard">
        <div className="text-destructive flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <AlertTriangle className="size-4" aria-hidden />
          <span>{result.error}</span>
        </div>
      </PageContainer>
    );
  }

  const greeting = authUser?.email ? `, ${authUser.email}` : "";

  return (
    <PageContainer
      pageTitle="Dashboard"
      actionSlot={<DashboardPeriodToggle currentWindow={window} />}
    >
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Overview of your {result.scope === "global" ? "platform" : "store"}
          {greeting} for the last {window.replace("d", " days")}.
        </p>
        <DashboardKpiGrid summary={result} />
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <DashboardAttentionList items={result.attention} />
          </div>
          <div className="lg:col-span-3">
            <DashboardRecentActivity items={result.recent} />
          </div>
        </div>
        {result.scope === "global" && result.topStores.length > 0 && (
          <DashboardTopStores stores={result.topStores} />
        )}
      </div>
    </PageContainer>
  );
}
