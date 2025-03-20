import { Metadata } from "next";
import { ReactNode } from "react";
import LoginForm from "@/modules/guest/components/client/login/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function Page() {
  return (
    <div className="w-full h-screen bg-slate-200 flex flex-col justify-center items-center">
      <LoginForm />
    </div>
  );
}
