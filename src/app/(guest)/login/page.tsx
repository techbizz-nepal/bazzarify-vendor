import { Metadata } from "next";
import LoginForm from "@/modules/guest/components/client/login/LoginForm";
import { getSessionPayload } from "@/modules/core/lib/utils.session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default async function Page() {
  return (
    <main className="w-full h-screen bg-slate-200 flex flex-col justify-center items-center">
      <LoginForm />
    </main>
  );
}
