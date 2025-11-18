import {
  getCookieStore,
  getSessionDecrypted,
} from "@/modules/core/lib/utils.session";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function GuestLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  if (await getSessionDecrypted(await getCookieStore())) {
    redirect("/");
  }
  return children;
}
