import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/modules/core/components/server/AppSidebar";
import { getSessionPayload } from "@/modules/core/lib/utils.session";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

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
        <main className="flex-1 space-y-3 bg-slate-200">
          <div className="flex h-16 items-center bg-white">
            <SidebarTrigger />
          </div>
          <div className="flex-col space-y-5 px-4">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}
