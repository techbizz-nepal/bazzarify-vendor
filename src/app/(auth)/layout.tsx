import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getSessionToken } from "@/modules/auth/data/lib/auth-lib";
import { AppSidebar } from "@/modules/core/components/server/AppSidebar";
import { getCookieStore } from "@/modules/core/lib/utils.session";
import AccountActions from "@/modules/dashboard/components/client/AccountActions";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const token = await getSessionToken(await getCookieStore());
  if (!token) {
    redirect("/login");
  }
  return (
    <div className="flex min-h-svh flex-col">
      <SidebarProvider className="flex min-h-svh flex-row">
        <AppSidebar className="flex-none" />
        <main className="flex min-w-0 flex-1 flex-col space-y-3 bg-slate-200">
          <div className="flex h-16 items-center justify-between bg-white px-4">
            <SidebarTrigger />
            <AccountActions />
          </div>
          <div className="flex min-w-0 flex-1 flex-col space-y-5 px-4">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
