"use client";

import DashboardKpiTile from "@/modules/dashboard/components/client/DashboardKpiTile";
import type { TDashboardSummary } from "@/modules/dashboard/schemas/dashboard-summary-schema";
import {
  FileSpreadsheet,
  PackageOpen,
  PackagePlus,
  ReceiptText,
  ShoppingBag,
  Store as StoreIcon,
  Users,
  Wallet,
} from "lucide-react";

type Props = {
  summary: TDashboardSummary;
};

export default function DashboardKpiGrid({ summary }: Props) {
  const { kpis, scope } = summary;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      <DashboardKpiTile
        label="Orders"
        kpi={kpis.orders}
        icon={<ShoppingBag className="size-4" />}
      />
      <DashboardKpiTile
        label="Revenue"
        kpi={kpis.revenue}
        format="currency"
        icon={<Wallet className="size-4" />}
      />
      <DashboardKpiTile
        label="Active products"
        kpi={kpis.activeProducts}
        icon={<PackageOpen className="size-4" />}
      />
      <DashboardKpiTile
        label="Drafts"
        kpi={kpis.draftProducts}
        icon={<PackagePlus className="size-4" />}
        invertDelta
      />
      <DashboardKpiTile
        label="Imports"
        kpi={kpis.imports}
        icon={<FileSpreadsheet className="size-4" />}
      />
      {scope === "global" && kpis.stores && (
        <DashboardKpiTile
          label="Stores"
          kpi={kpis.stores}
          icon={<StoreIcon className="size-4" />}
        />
      )}
      {scope === "global" && kpis.users && (
        <DashboardKpiTile
          label="Users"
          kpi={kpis.users}
          icon={<Users className="size-4" />}
        />
      )}
      {scope === "vendor" && (
        <DashboardKpiTile
          label="Revenue per order"
          kpi={deriveRevenuePerOrder(summary)}
          format="currency"
          icon={<ReceiptText className="size-4" />}
        />
      )}
    </div>
  );
}

function deriveRevenuePerOrder(summary: TDashboardSummary) {
  const { orders, revenue } = summary.kpis;
  const safeDivide = (num: number, den: number) => (den > 0 ? num / den : 0);
  const value = safeDivide(revenue.value, orders.value);
  const previous = safeDivide(revenue.previous, orders.previous);
  const deltaPct =
    previous === 0
      ? value > 0
        ? 100
        : null
      : Math.round(((value - previous) / previous) * 10000) / 100;
  const sparkline = revenue.sparkline.map((rev, index) => {
    const orderCount = orders.sparkline[index] ?? 0;
    return orderCount > 0 ? rev / orderCount : 0;
  });

  return { value, previous, deltaPct, sparkline };
}
