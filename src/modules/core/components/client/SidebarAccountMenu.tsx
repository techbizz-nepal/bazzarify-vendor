"use client";

import { ChevronUp, CircleAlert, LogOut, Settings, Store } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { actionLogout } from "@/modules/guest/actions/login";

type SidebarAccountAction = {
  href: string;
  label: string;
  tone?: "default" | "warning";
};

type SidebarAccountMenuProps = {
  initials: string;
  displayName: string;
  secondaryText: string;
  email: string | null;
  roleSummary: string;
  identitySummary: string;
  settingsHref: string | null;
  profileHref: string | null;
  storeAction: SidebarAccountAction | null;
};

export default function SidebarAccountMenu({
  initials,
  displayName,
  secondaryText,
  email,
  roleSummary,
  identitySummary,
  settingsHref,
  profileHref,
  storeAction,
}: SidebarAccountMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-3 rounded-2xl border border-white/70 bg-white px-3 py-3 text-left shadow-sm transition-colors outline-none hover:bg-white/95 focus-visible:border-sidebar-selected focus-visible:ring-2 focus-visible:ring-sidebar-selected/20",
          )}
        >
          <div className="bg-sidebar-selected text-sidebar-selected-foreground flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {displayName}
            </p>
            <p className="truncate text-xs text-sidebar-selected/80">
              {secondaryText}
            </p>
          </div>
          <ChevronUp className="text-sidebar-selected/80 size-4 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="top"
        className="w-72 rounded-2xl p-2"
      >
        <DropdownMenuLabel className="rounded-xl px-3 py-3">
          <div className="flex items-start gap-3">
            <div className="bg-sidebar-selected text-sidebar-selected-foreground flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
              {initials}
            </div>
            <div className="min-w-0 space-y-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {displayName}
              </p>
              <p className="text-sidebar-selected truncate text-xs font-medium">
                {identitySummary}
              </p>
              {email ? (
                <p className="text-muted-foreground truncate text-xs">
                  {email}
                </p>
              ) : null}
              <p className="text-muted-foreground truncate text-xs">
                {roleSummary}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        {(settingsHref || profileHref || storeAction) && (
          <DropdownMenuSeparator />
        )}
        <DropdownMenuGroup>
          {profileHref ? (
            <DropdownMenuItem asChild>
              <Link href={profileHref}>
                <Store className="size-4" />
                Vendor capability profile
              </Link>
            </DropdownMenuItem>
          ) : null}
          {settingsHref ? (
            <DropdownMenuItem asChild>
              <Link href={settingsHref}>
                <Settings className="size-4" />
                Store onboarding settings
              </Link>
            </DropdownMenuItem>
          ) : null}
          {storeAction ? (
            <DropdownMenuItem
              asChild
              className={cn(
                storeAction.tone === "warning" &&
                  "text-amber-700 focus:bg-amber-50 focus:text-amber-700 [&_svg]:text-amber-700",
              )}
            >
              <Link href={storeAction.href}>
                {storeAction.tone === "warning" ? (
                  <CircleAlert className="size-4" />
                ) : (
                  <Store className="size-4" />
                )}
                {storeAction.label}
              </Link>
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form action={actionLogout}>
          <DropdownMenuItem
            asChild
            variant="destructive"
            className="w-full cursor-pointer"
          >
            <button type="submit">
              <LogOut className="size-4" />
              Logout
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
