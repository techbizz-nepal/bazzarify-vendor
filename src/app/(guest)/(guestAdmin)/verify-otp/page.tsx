import ResetPasswordVerification from "@/modules/guest/components/client/ResetPasswordVerification";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Verify Reset Code",
  description: "Verify your reset code and update your password",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string | string[] }>;
}) {
  const resolvedSearchParams = await searchParams;
  const phone = Array.isArray(resolvedSearchParams.phone)
    ? resolvedSearchParams.phone[0]
    : resolvedSearchParams.phone;

  if (!phone) {
    redirect("/reset-password");
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-200">
      <ResetPasswordVerification phone={phone} />
    </div>
  );
}
