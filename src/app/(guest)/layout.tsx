import { ReactNode } from "react";
import { getSessionPayload } from "@/modules/core/lib/utils.session";
import { redirect } from "next/navigation";

export default async function GuestLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  if (await getSessionPayload()) {
    redirect("/");
  }
  return children;
}
