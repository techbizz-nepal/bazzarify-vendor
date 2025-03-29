"use client";

import { useRouter } from "next/navigation";
import useSession from "@/modules/core/hooks/useSession";
import useVendorRegistration from "@/modules/guest/hooks/useVendorRegistration";
import { Suspense } from "react";
import { LoaderPinwheel } from "lucide-react";
import VerifyOTPForm from "@/modules/guest/components/client/VerifyOTPForm";
import { handlePasswordResetVerification } from "@/modules/guest/actions/auth";

export default function Page() {
  const router = useRouter();
  const { toggleSession } = useSession(router);
  const { verifyOTPForm } = useVendorRegistration(router, toggleSession);
  return (
    <Suspense fallback={<LoaderPinwheel />}>
      <div className="w-full h-screen bg-slate-200 flex flex-col justify-center items-center">
        <VerifyOTPForm
          form={verifyOTPForm}
          onSubmitAction={handlePasswordResetVerification}
          buttonLabel="Update Password"
          formTitle="Password Reset"
          formHelpText="We Will Help You Reset your Password"
          className="flex w-4/12 flex-col space-y-6 rounded-md bg-white p-16"
        />
      </div>
    </Suspense>
  );
}
