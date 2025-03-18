import React, { ReactNode } from "react";
import { AppSidebar } from "@/modules/core/components/server/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div>
        <SidebarTrigger />
        <div className=" bg-slate-200 overflow-y-auto">{children}</div>
      </div>
    </SidebarProvider>
  );
}
