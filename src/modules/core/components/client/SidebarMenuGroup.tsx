"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  isNavGroupActive,
  isNavLinkActive,
} from "@/modules/core/lib/nav-active";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export type TSidebarGroupChild = {
  title: string;
  path: string;
  icon: ReactNode;
};

export type TSidebarGroupProps = {
  title: string;
  defaultPath: string;
  pathMatch: string;
  icon: ReactNode;
  items: TSidebarGroupChild[];
};

function resolveActiveChildPath(
  pathname: string,
  items: TSidebarGroupChild[],
): string | undefined {
  let bestMatchPath: string | undefined = undefined;
  for (const item of items) {
    if (!isNavLinkActive(pathname, item.path)) continue;
    if (!bestMatchPath || item.path.length > bestMatchPath.length) {
      bestMatchPath = item.path;
    }
  }
  return bestMatchPath;
}

export default function SidebarMenuGroupComponent({
  title,
  defaultPath,
  pathMatch,
  icon,
  items,
}: TSidebarGroupProps) {
  const pathname = usePathname();
  const groupActive = isNavGroupActive(pathname, pathMatch);
  const activeChildPath = resolveActiveChildPath(pathname, items);
  const [open, setOpen] = useState<boolean>(groupActive);

  useEffect(() => {
    if (groupActive) setOpen(true);
  }, [groupActive]);

  return (
    <Collapsible
      asChild
      open={open}
      onOpenChange={setOpen}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip={title}
          className="py-6 font-medium hover:bg-sidebar-selected/15 hover:text-sidebar-foreground"
        >
          <Link href={defaultPath}>
            {icon}
            <span>{title}</span>
          </Link>
        </SidebarMenuButton>
        <CollapsibleTrigger asChild>
          <SidebarMenuAction
            aria-label={`Toggle ${title} section`}
            className="top-3 text-sidebar-foreground transition-transform duration-200 hover:bg-sidebar-selected/15 hover:text-sidebar-foreground data-[state=open]:rotate-90"
          >
            <ChevronRight />
          </SidebarMenuAction>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <SidebarMenuSub>
            {items.map((item) => (
              <SidebarMenuSubItem key={item.path}>
                <SidebarMenuSubButton
                  asChild
                  isActive={item.path === activeChildPath}
                  className="hover:bg-sidebar-selected/15 hover:text-sidebar-foreground"
                >
                  <Link href={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
