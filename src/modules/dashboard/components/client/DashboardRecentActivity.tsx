"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TDashboardRecentItem } from "@/modules/dashboard/schemas/dashboard-summary-schema";
import { formatDistanceToNow, parseISO } from "date-fns";
import { FileSpreadsheet, PackageOpen, ShoppingBag } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  items: readonly TDashboardRecentItem[];
};

const KIND_ICON: Record<TDashboardRecentItem["kind"], ReactNode> = {
  order: <ShoppingBag className="size-4" aria-hidden />,
  product: <PackageOpen className="size-4" aria-hidden />,
  import: <FileSpreadsheet className="size-4" aria-hidden />,
};

const relative = (iso: string): string => {
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true });
  } catch {
    return "";
  }
};

export default function DashboardRecentActivity({ items }: Props) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Recent activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-muted-foreground rounded-md border border-dashed p-4 text-sm">
            No activity in this window yet.
          </p>
        ) : (
          <ul className="divide-y">
            {items.map((item, index) => (
              <li key={`${item.kind}-${item.href}-${index}`}>
                <Link
                  href={item.href}
                  className="flex items-start gap-3 py-2.5 text-sm transition-colors hover:text-sidebar-selected"
                >
                  <span className="bg-muted text-muted-foreground mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full">
                    {KIND_ICON[item.kind]}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium">{item.label}</span>
                    <span className="text-muted-foreground text-xs">
                      {relative(item.at)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
