import ResetPasswordForm from "@/modules/guest/components/client/ResetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your password",
};
export default function Page() {
  return (
    <div className="w-full h-screen bg-slate-200 flex flex-col justify-center items-center">
      <ResetPasswordForm />
    </div>
  );
}
