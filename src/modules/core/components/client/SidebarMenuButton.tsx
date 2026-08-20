"use client";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { TMenuLink } from "@/modules/core/data";
import { isNavLinkActive } from "@/modules/core/lib/nav-active";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function SidebarMenuButtonComponent({
  children,
  routePath,
  title,
}: {
  children: ReactNode;
  routePath: TMenuLink["path"];
  title: TMenuLink["title"];
}) {
  const pathname = usePathname();
  return (
    <SidebarMenuButton
      asChild
      className="py-6 font-medium hover:bg-sidebar-selected/15 hover:text-sidebar-foreground"
      tooltip={title}
      isActive={isNavLinkActive(pathname, routePath)}
    >
      <Link href={routePath}>
        {children}
        <span>{title}</span>
      </Link>
    </SidebarMenuButton>
  );
}
