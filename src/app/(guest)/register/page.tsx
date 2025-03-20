import { Metadata } from "next";
import VendorRegistrationForm from "@/modules/guest/components/client/VendorRegistrationForm";
import { VerifyOtpFormValues } from "@/modules/guest/config/schemas/verify.otp.form";
import { toast } from "sonner";
import { redirect } from "next/navigation";

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
