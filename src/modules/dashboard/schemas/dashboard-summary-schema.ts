import { z } from "zod";

export const DASHBOARD_WINDOWS = ["7d", "30d", "90d"] as const;
export type DashboardWindow = (typeof DASHBOARD_WINDOWS)[number];

export const DashboardScopeSchema = z.enum(["vendor", "global"]);
export type DashboardScope = z.infer<typeof DashboardScopeSchema>;

const KpiSchema = z
  .object({
    value: z.number(),
    previous: z.number(),
    deltaPct: z.number().nullable(),
    sparkline: z.array(z.number()),
  })
  .strip();

const AttentionSeveritySchema = z.enum(["error", "warn", "info"]);

const AttentionItemSchema = z
  .object({
    kind: z.string(),
    severity: AttentionSeveritySchema,
    message: z.string(),
    href: z.string(),
    count: z.number().int().nonnegative().optional(),
  })
  .strip();

const RecentActivityItemSchema = z
  .object({
    kind: z.enum(["order", "product", "import"]),
    at: z.string(),
    label: z.string(),
    href: z.string(),
    amount: z.number().optional(),
  })
  .strip();

const TopStoreSchema = z
  .object({
    uuid: z.string(),
    name: z.string(),
    products: z.number().int().nonnegative(),
    revenue: z.number(),
  })
  .strip();

const KpisCoreSchema = z.object({
  orders: KpiSchema,
  revenue: KpiSchema,
  activeProducts: KpiSchema,
  draftProducts: KpiSchema,
  imports: KpiSchema,
  stores: KpiSchema.optional(),
  users: KpiSchema.optional(),
});

export const DashboardSummarySchema = z
  .object({
    scope: DashboardScopeSchema,
    period: z
      .object({
        window: z.enum(DASHBOARD_WINDOWS),
        from: z.string(),
        to: z.string(),
      })
      .strip(),
    kpis: KpisCoreSchema,
    attention: z.array(AttentionItemSchema),
    recent: z.array(RecentActivityItemSchema),
    topStores: z.array(TopStoreSchema),
  })
  .strip();

export type TDashboardSummary = z.infer<typeof DashboardSummarySchema>;
export type TDashboardKpi = z.infer<typeof KpiSchema>;
export type TDashboardAttentionItem = z.infer<typeof AttentionItemSchema>;
export type TDashboardRecentItem = z.infer<typeof RecentActivityItemSchema>;
export type TDashboardTopStore = z.infer<typeof TopStoreSchema>;
export type TDashboardAttentionSeverity = z.infer<
  typeof AttentionSeveritySchema
>;

export const DashboardSummaryPayloadSchema = z
  .object({
    summary: DashboardSummarySchema,
  })
  .strip();

export type TDashboardSummaryPayload = z.infer<
  typeof DashboardSummaryPayloadSchema
>;
