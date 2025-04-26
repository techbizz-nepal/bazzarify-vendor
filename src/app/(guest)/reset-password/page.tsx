import ResetPasswordForm from "@/modules/guest/components/client/ResetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your password",
};
export default function Page() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-200">
      <ResetPasswordForm />
    </div>
  );
}
