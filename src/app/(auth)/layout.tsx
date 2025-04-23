import React, { ReactNode } from "react";
import { AppSidebar } from "@/modules/core/components/server/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getSessionPayload } from "@/modules/core/lib/utils.session";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  if (!(await getSessionPayload())) {
    redirect("/login");
  }
  return (
    <div className="flex-col">
      <SidebarProvider className="flex-row">
        <AppSidebar className="flex-none" />
        <main className="bg-slate-200 flex-1 space-y-3">
          <div className="bg-white h-16 flex items-center">
            <SidebarTrigger />
          </div>
          <div className="px-4 flex-col space-y-5">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}
