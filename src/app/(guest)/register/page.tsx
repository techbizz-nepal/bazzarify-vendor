import { Metadata } from "next";
import VendorRegistrationForm from "@/modules/guest/components/client/VendorRegistrationForm";

export const metadata: Metadata = {
  title: "Register",
  description: "Register account",
};

export default function Page() {
  return (
    <div className="w-full h-screen flex-col py-2 space-y-6">
      <VendorRegistrationForm />
    </div>
  );
}
