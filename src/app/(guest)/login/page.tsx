import LoginActions from "@/modules/guest/components/client/login/LoginActions";
import LoginForm from "@/modules/guest/components/client/login/LoginForm";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default async function Page() {
  const requestHeaders = await headers();
  const isVendor = requestHeaders.get("host")?.startsWith("vendor.");
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-slate-200">
      <div className="flex w-11/12 md:w-6/12  flex-col space-y-6 rounded-md bg-white p-16">
        <LoginForm />
        {isVendor && <LoginActions />}
      </div>
    </main>
  );
}
