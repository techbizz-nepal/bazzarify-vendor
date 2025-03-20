"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSession from "@/modules/core/hooks/useSession";
import useVendorRegistration from "@/modules/guest/hooks/useVendorRegistration";
import Banner from "@/modules/guest/components/client/registration/Banner";
import Header from "@/modules/guest/components/client/registration/Header";
import WhySellOnBazzarify from "@/modules/guest/components/client/registration/WhySellOnBazzarify";
import OTPVerificationRequestForm from "@/modules/guest/components/client/registration/OTPVerificationRequestForm";
import VerifyOTPForm from "@/modules/guest/components/client/VerifyOTPForm";
import { PiSpinner } from "react-icons/pi";
import { handleRegisterVerification } from "@/modules/guest/actions/auth";

export default function VendorRegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<number>(1);
  useSession(router);
  const { form, handleOTPRequestSubmit } = useVendorRegistration(
    setStep,
    router,
  );
  return (
    <>
      <Header />
      <Banner>
        {searchParams.size == 0 && (
          <OTPVerificationRequestForm
            form={form}
            onSubmit={handleOTPRequestSubmit}
          />
        )}
        {searchParams.has("phone") && (
          <VerifyOTPForm
            onSubmitAction={handleRegisterVerification}
            buttonLabel="Next"
            formHelpText="Enter the 6 digit code sent"
            formTitle="Enter the code"
            className="flex flex-col space-y-7"
          />
        )}
        {searchParams.has("verified") && <PiSpinner size={20} />}
      </Banner>
      <WhySellOnBazzarify />
    </>
  );
}
