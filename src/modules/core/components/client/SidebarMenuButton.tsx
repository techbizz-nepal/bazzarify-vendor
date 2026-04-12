"use client";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { TMenuItem } from "@/modules/core/data";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

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
      className="py-6 font-medium"
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
