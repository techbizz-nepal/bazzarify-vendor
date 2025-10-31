import { getSessionPayload } from "@/modules/core/lib/utils.session";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function GuestLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  if (await getSessionPayload()) {
    console.log(
      "get session payload on guest layout: ",
      await getSessionPayload(),
    );

    redirect("/");
  }
  return children;
}
