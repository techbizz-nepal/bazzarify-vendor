"use client";

import { ReactNode } from "react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { TMenuItem } from "@/modules/core/data";

export default function SidebarMenuButtonComponent({
  children,
  routePath,
  title,
}: {
  children: ReactNode;
  routePath: TMenuItem["path"];
  title: TMenuItem["title"];
}) {
  const pathname = usePathname();
  return (
    <SidebarMenuButton
      asChild
      className="py-6"
      isActive={
        routePath === "/" ? pathname === "/" : pathname.includes(routePath)
      }
    >
      <a href={routePath}>
        {children}
        <span>{title}</span>
      </a>
    </SidebarMenuButton>
  );
}
