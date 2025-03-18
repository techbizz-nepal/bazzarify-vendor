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
      <div className="bg-slate-200 flex w-screen h-screen flex-col px-2 flex-1">
        <SidebarTrigger />
        {children}
      </div>
    </SidebarProvider>
  );
}
