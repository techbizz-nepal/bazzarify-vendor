"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  DASHBOARD_WINDOWS,
  type DashboardWindow,
} from "@/modules/dashboard/schemas/dashboard-summary-schema";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type Props = {
  currentWindow: DashboardWindow;
};

const LABELS: Record<DashboardWindow, string> = {
  "7d": "Last 7d",
  "30d": "Last 30d",
  "90d": "Last 90d",
};

export default function DashboardPeriodToggle({ currentWindow }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleChange = (next: string) => {
    if (!next || next === currentWindow) return;
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("window", next);
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <ToggleGroup
      type="single"
      value={currentWindow}
      onValueChange={handleChange}
      variant="outline"
      size="sm"
      disabled={isPending}
      aria-label="Select dashboard time window"
    >
      {DASHBOARD_WINDOWS.map((w) => (
        <ToggleGroupItem key={w} value={w} aria-label={LABELS[w]}>
          {LABELS[w]}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
