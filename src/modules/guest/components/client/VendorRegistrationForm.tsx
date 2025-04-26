"use client";

import useSession from "@/modules/core/hooks/useSession";
import Banner from "@/modules/guest/components/client/registration/Banner";
import RegistrationRequest from "@/modules/guest/components/client/registration/RegistrationRequest";
import RegistrationVerification from "@/modules/guest/components/client/registration/RegistrationVerification";
import SetBusinessAndEmailForm from "@/modules/guest/components/client/registration/SetBusinessAndEmailForm";
import useVendorRegistration from "@/modules/guest/hooks/useVendorRegistration";
import { useRouter, useSearchParams } from "next/navigation";

export default function VendorRegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toggleSession } = useSession(router);
  const {
    registrationRequestForm,
    registrationRequestVerificationForm,
    businessAndEmailForm,
    handleRequestRegistration,
    handleRegistrationVerification,
    handleSetBusinessAndEmailSubmit,
  } = useVendorRegistration(router, searchParams, toggleSession);
  return (
    <>
      <Banner>
        {searchParams.size == 0 && (
          <RegistrationRequest
            form={registrationRequestForm}
            onSubmit={handleRequestRegistration}
          />
        )}
        {searchParams.has("phone") && (
          <RegistrationVerification
            form={registrationRequestVerificationForm}
            onSubmitAction={handleRegistrationVerification}
            buttonLabel="Next"
            formHelpText="Enter the 6 digit code sent"
            formTitle="Enter the code"
            className="flex flex-col space-y-7"
          />
        )}
        {searchParams.has("verified") && (
          <SetBusinessAndEmailForm
            form={businessAndEmailForm}
            onSubmit={handleSetBusinessAndEmailSubmit}
          />
        )}
      </Banner>
    </>
  );
}
