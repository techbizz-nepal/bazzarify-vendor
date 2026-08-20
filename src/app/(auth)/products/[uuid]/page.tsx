import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  return redirect("/products/".concat(uuid, "/view"));
}
