import {
  getCookieStore,
  getSessionDecrypted,
} from "@/modules/core/lib/utils.session";
import AppProviders from "@/modules/core/components/client/AppProviders";
import { Sora } from "next/font/google";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export const dynamic = "force-dynamic";

const sora = Sora({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  subsets: ["latin", "latin-ext"],
});

export default async function GuestLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  if (await getSessionDecrypted(await getCookieStore())) {
    redirect("/");
  }
  return (
    <AppProviders>
      <div className={`${sora.className} antialiased`}>{children}</div>
    </AppProviders>
  );
}
