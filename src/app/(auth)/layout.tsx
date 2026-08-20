import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getSessionToken } from "@/modules/auth/data/lib/auth-lib";
import AppProviders from "@/modules/core/components/client/AppProviders";
import { AppSidebar } from "@/modules/core/components/server/AppSidebar";
import { getCookieStore } from "@/modules/core/lib/utils.session";
import { Sora } from "next/font/google";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export const dynamic = "force-dynamic";

const sora = Sora({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  subsets: ["latin", "latin-ext"],
});

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
    <AppProviders>
      <div className={`${sora.className} flex min-h-svh flex-col antialiased`}>
        <SidebarProvider className="flex min-h-svh flex-row">
          <AppSidebar className="flex-none" />
          <main className="flex min-w-0 flex-1 flex-col space-y-3 bg-slate-200">
            <div className="flex h-16 items-center bg-white px-4">
              <SidebarTrigger />
            </div>
            <div className="flex min-w-0 flex-1 flex-col space-y-5 px-4">
              {children}
            </div>
          </main>
        </SidebarProvider>
      </div>
    </AppProviders>
  );
}
