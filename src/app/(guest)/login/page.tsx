import LoginForm from "@/modules/guest/components/client/login/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default async function Page() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-slate-200">
      <LoginForm />
    </main>
  );
}
